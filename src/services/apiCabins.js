import supabase from "./supabase";

export async function getCabins() {
  const { data: cabins, error } = await supabase.from("cabins").select("*");
  if (error) {
    throw new Error(error);
  }
  return cabins;
}

export async function delCabin(id) {
  // 要想成功删除, 需要为 table 'cabins' 的 row level policies 添加 delete policy
  const { error } = await supabase.from("cabins").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  // 如果没有 return value, 默认 return undefined;
}

export async function createCabin(cabin) {
  const imageFile = cabin.image[0]; // image 对应的 File instance
  // 替换 image name 中可能有的 '/', 防止 supabase 自动生成 subfolder
  // 如果确实需要将 image 存放在 bucket 下指定 subfolder 内, 那么 imagePath 内包含 '/' 是正常的
  const imagePath = `${Math.random()}-${imageFile.name}`.replace("/", ""); // 相对于 bucket root 的 path

  // step-1. 将图片上传到 supabase storage
  const { data: imageData, error: imageError } = await supabase.storage
    .from("cabin-images")
    .upload(imagePath, imageFile, {
      cacheControl: "3600", // file 在 browser 和 supabase CDN 中缓存多久, 默认为 3600s (one hour)
      upsert: false, // 如果 imagePath 对应的 file 已经存在, 不要覆盖, 而是直接报错
    });
  if (imageError) {
    throw new Error(`failed to upload image due to:${imageError.message}`);
  }
  //fullPath: 带有 bucket root 的 path
  console.log(`imageData.fullPath: ${imageData.fullPath}`); //cabin-images/0.3587953130386382-cabin-002.jpg
  //path: 不带 bucket root 的 path
  console.log(`imageData.path: ${imageData.path}`); //0.3587953130386382-cabin-002.jpg

  // step-2. 为 file 创建 signed url (带有效期的 url)
  const { data: urlData, error: urlError } = await supabase.storage
    .from("cabin-images")
    .createSignedUrl(imageData.path, 1 * 365 * 24 * 60 * 60); // 有效期 1 年, 单位: 秒

  // step-3. 创建 cabin row
  const { data: cabinData, error: cabinError } = await supabase
    .from("cabins")
    .insert([{ ...cabin, image: urlData.signedUrl }])
    .select(); // 要想使用 data (modified rows), 就得额外 .select() 一次

  if (cabinError) {
    await supabase.storage.from("cabin-images").remove([imageData.path]); // cabin row insert 失败, 那么之前上传的 cabin image 也就没有意义了
    throw new Error(`failed to insert cabin row due to ${cabinError.message}`);
  }
  return cabinData;
}
