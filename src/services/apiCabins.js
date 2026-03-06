import supabase from "./supabase";

export async function getCabins() {
  const { data: cabins, error } = await supabase.from("cabins").select("*");
  if (error) {
    throw new Error(error.message);
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

export async function createOrUpdateCabin(cabin) {
  // 如果是 create cabin, image 是 required input, 因此 image 是 File instance, 此时需要 upload image file
  // 如果是 edit/update cabin, image 不是 required input, 因此 image 可能是:
  // 1. 原有的 signed url
  //    此时不需要 upload image file
  // 2. 新指定的 File instance
  //    此时需要 upload image file

  let uploadResult;
  if (typeof cabin.image !== "string") {
    // 此时 image 是 File instance, 需要 upload image to supabase storage
    // 并将返回的 signed url 赋值给 cabin.image
    uploadResult = await uploadFile(cabin.image[0]);
    cabin.image = uploadResult.signedUrl;
  }
  // 此时: cabin.image 一定是 signed url, 可能是之前的 signed url, 也可能是上传后重新获取的 signed url
  if (cabin.id === undefined) {
    // 需要 create cabin, 此时:
    // uploadResult 一定有值, 其内的 key 'signedUrl' 和 'path' 都可以使用
    const { data, error } = await supabase
      .from("cabins")
      .insert([cabin])
      .select() //得到 modified rows
      .single(); //得到 first modified row

    if (error) {
      // cabin row create 失败, 那么之前上传的 cabin image 也就没有意义了
      await supabase.storage.from("cabin-images").remove([uploadResult.path]);
      throw new Error(`failed to create cabin row due to ${error.message}`);
    }
    return data;
  } else {
    // 需要 update cabin, 此时:
    // uploadResult 可能有值(用户重新指定了 image), 也可能没值(用户未重新指定 image)
    const { data, error } = await supabase
      .from("cabins")
      .update(cabin)
      .eq("id", cabin.id)
      .select()
      .single();
    if (error) {
      // cabin row update 失败
      if (uploadResult !== undefined) {
        // 如果之前上传了 cabin image, 就没有意义了
        await supabase.storage.from("cabin-images").remove([uploadResult.path]);
      }
      throw new Error(`failed to update cabin row due to ${error.message}`);
    }
    return data;
  }
}

async function uploadFile(file) {
  // 替换 image name 中可能有的 '/', 防止 supabase 自动生成 subfolder
  // 如果确实需要将 image 存放在 bucket 下指定 subfolder 内, 那么 imagePath 内包含 '/' 是正常的
  const path = `${file.name}`.replace("/", ""); // 相对于 bucket root 的 path

  const { data, error } = await supabase.storage
    .from("cabin-images")
    .exists(path);

  // 如果 path 对应的 file 不存在, 就上传
  if (!data) {
    const { data: fileData, error: imageError } = await supabase.storage
      .from("cabin-images")
      .upload(path, file, {
        cacheControl: "3600", // file 在 browser 和 supabase CDN 中缓存多久, 默认为 3600s (one hour)
        upsert: false, // 如果 imagePath 对应的 file 已经存在, 不要覆盖, 而是直接报错
      });
    if (imageError) {
      throw new Error(`failed to upload image due to:${imageError.message}`);
    }
    //fullPath: 带有 bucket root 的 path
    console.log(`fileData.fullPath: ${fileData.fullPath}`); //cabin-images/0.3587953130386382-cabin-002.jpg
    //path: 不带 bucket root 的 path
    console.log(`fileData.path: ${fileData.path}`); //0.3587953130386382-cabin-002.jpg
  }

  // 此时 file 一定存在, 为 file 创建 signed url (带有效期的 url)
  const { data: urlData, error: urlError } = await supabase.storage
    .from("cabin-images")
    .createSignedUrl(path, 1 * 365 * 24 * 60 * 60); // 有效期 1 年, 单位: 秒

  if (urlError) {
    throw new Error(
      `failed to retrieve signed url of file located at ${path}`,
    );
  }

  return { signedUrl: urlData.signedUrl, path: path };
}
