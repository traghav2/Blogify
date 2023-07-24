const blogTitle = document.querySelector('.title');
const article = document.querySelector('.article');

const bannerImage = document.querySelector('#banner-upload');
const banner = document.querySelector('.banner');
let bannerPath; 

const publishBtn = document.querySelector('.publish-btn');
const uploadInput = document.querySelector('#image-upload');

uploadInput.addEventListener('change', () => {
    uploadImage(uploadInput, "image")
})

bannerImage.addEventListener('change', () => {
    uploadImage(bannerImage, 'banner');
})

const uploadImage = async (uploadFile, uploadType) => {
    const [file] = uploadFile.files;
    if (file && file.type.includes("image")) {
      const formData = new FormData();
      formData.append("image", file);
  
      const response = await fetch("/upload", {
        method: "post",
        body: formData
      });

      console.log(response);

  
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        if(uploadType == "image"){
            const imagePath = data;
            addImage(imagePath, file.name);
        }else {
            bannerPath = `${location.origin}/${data}`;
            banner.style.backgroundImage = `url("${bannerPath}")`;
        }
      }
    }
  };

  const addImage = (imagePath, alt) => {
    console.log(imagePath);
    let curPos = article.selectionStart;
    let textToInsert = `\r[${alt}](${imagePath})\r`
    article.value = article.value.slice(0, curPos) + textToInsert + article.value.slice(curPos);
  }