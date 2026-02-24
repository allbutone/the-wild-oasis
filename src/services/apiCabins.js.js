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
  if(error){
    throw new Error(error.message);
  }
  // 如果没有 return value, 默认 return undefined;
}
