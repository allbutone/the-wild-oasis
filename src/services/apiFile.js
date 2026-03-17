import supabase from "./supabase";

// file: File instance
// path: 存储在 bucket root 的什么位置/路径
// path 中的 / 表示创建 subfolder, 如果不想创建 subfolder, 可将其中的 '/' 替换掉
export async function uploadFile(bucketName, file, path) {
  const { data: uploadResult, error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(path, file, {
      cacheControl: "3600", // file 在 browser 和 supabase CDN 中缓存多久, 默认为 3600s (one hour)
      upsert: true, // 直接覆盖已存在的文件
    });
  if (uploadError) {
    throw new Error(`failed to upload image due to:${uploadError.message}`);
  }
  //fullPath: 带有 bucket root 的 path
  console.log(`fileData.fullPath: ${uploadResult.fullPath}`); //cabin-images/0.3587953130386382-cabin-002.jpg
  //path: 不带 bucket root 的 path
  console.log(`fileData.path: ${uploadResult.path}`); //0.3587953130386382-cabin-002.jpg

  // 此时 file 一定存在, 为 file 创建 signed url (带有效期的 url)
  const { data: urlData, error: urlError } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(path, 1 * 365 * 24 * 60 * 60); // 有效期 1 年, 单位: 秒

  if (urlError) {
    throw new Error(`failed to retrieve signed url of file located at ${path}`);
  }

  return { signedUrl: urlData.signedUrl, path: path };
}
