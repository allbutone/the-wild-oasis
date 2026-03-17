import { uploadFile } from "./apiFile";
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
    const file = cabin.image[0];
    uploadResult = await uploadFile('cabin-images', file, file.name.replace('/', ''));
    cabin.image = uploadResult.signedUrl;
  }
  // 此时: cabin.image 一定是 signed url, 可能是之前的 signed url, 也可能是上传后重新获取的 signed url
  let query = supabase.from("cabins");
  if (cabin.id === undefined) {
    query = query.insert([cabin]);
  } else {
    query = query.update(cabin).eq("id", cabin.id);
  }
  const { data, error } = await query.select().single();
  if (error) {
    if (uploadResult !== undefined) {
      await supabase.storage.from("cabin-images").remove([uploadResult.path]);
    }
    throw new Error(`error occurred due to ${error.message}`);
  }
  return data;
}

