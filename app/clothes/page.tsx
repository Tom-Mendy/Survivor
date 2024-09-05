import SpawnHeadband from "../component/SpawnHeadband";
import ImgDisplay from "./imgDisplay";

const images = [
  {
    id: 1,
    imageUrl: "https://http.cat/images/530.jpg",
  },
  {
    id: 2,
    imageUrl:
      "https://i.kym-cdn.com/photos/images/newsfeed/002/422/058/391.jpg",
  },
  {
    id: 3,
    imageUrl:
      "https://image.spreadshirtmedia.net/image-server/v1/compositions/T235A1PA4253PT17X33Y9D186071565W6476H9353/views/1,width=1200,height=630,appearanceId=1,backgroundColor=F2F2F2/gnome-meme-dank-vous-avez-ete-gnomed-bavoir-bebe.jpg",
  },
  {
    id: 4,
    imageUrl:
      "https://media.threatpost.com/wp-content/uploads/sites/103/2021/10/14162918/rickroll-e1634243370645.jpg",
  },
  {
    id: 5,
    imageUrl:
      "https://http.cat/images/202.jpg",
  },
];

export default function Home() {
  return (
    <SpawnHeadband title="Clothes" littleText="Customize your drip">
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 space-y-1">
          <ImgDisplay images={images}></ImgDisplay>
          <ImgDisplay images={images}></ImgDisplay>
          <ImgDisplay images={images}></ImgDisplay>
        </div>
      </div>
    </SpawnHeadband>
  );
}
