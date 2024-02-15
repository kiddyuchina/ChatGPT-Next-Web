import OSS from "ali-oss";

export async function uploadFile(file: any) {
  if (!file) return;

  // 阿里云OSS配置
  const client = new OSS({
    region: "oss-cn-o493m2c4z090", // 你的OSS区域
    accessKeyId: "LTAI5tAaKKjp1vPaQunjKo8g", // 替换为你的AccessKeyId
    accessKeySecret: "nP9eNZ8uykazcgij5wwl6MTDm9tuDU", // 替换为你的AccessKeySecret
    bucket: "hypergpt", // 你的Bucket名称
  });

  try {
    // 使用STS凭证或RAM用户凭证进行客户端签名
    const { url } = await client.signatureUrl("uploads/${file.name}", {
      expires: 3600, // 签名有效时间，单位为秒
      method: "PUT", // 指定上传的方法
    });

    // 使用fetch直接上传文件到OSS
    const formData = new FormData();
    formData.append("key", `uploads/${file.name}`);
    formData.append("policy", client.policy);
    formData.append("OSSAccessKeyId", client.credentials.accessKeyId);
    formData.append("signature", client.signature);
    formData.append("file", file);

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      console.log("File uploaded successfully");
      // 获取文件的URL，通常是从response中解析出来，或者直接使用签名URL
    } else {
      console.error("Error uploading file");
    }
  } catch (error) {
    console.error("Error during upload:", error);
  }
}
