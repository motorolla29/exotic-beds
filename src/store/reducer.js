import { createReducer } from '@reduxjs/toolkit';

import {
  loadProducts,
  productsAreLoaded,
  cartOpen,
  addProductToCart,
  removeProductFromCart,
  increaseProductAmountInCart,
  decreaseProductAmountInCart,
  toggleProductInLovelist,
  setMapViewState,
  setNearStoresCenter,
} from './action';

import {
  getCartWithAddedProduct,
  getCartWithIncreasedProduct,
  getCartWithDecreasedProduct,
  updateLovelist,
} from '../utils';

import PRODUCTS from '../mocks/products';

const initialState = {
  products: PRODUCTS,
  productsAreLoaded: true,
  isCartOpen: false,
  sortType: null,
  cartProducts: [],
  lovelistProducts: [
    {
      id: 'Cyberpunk-Series-MRI-Complex-Bed-Set',
      category: 'beds',
      title: 'Cyberpunk Series MRI Complex Bed Set',
      description:
        "You don't need to visit the clinic every time you want to check something in your body with an Magnetic Resonance Imaging machine, since the machine is already included with our futuristic bed as a whole complex into which your bed can move and perform the study. All the necessary computers and displays with the ability to take the result and immediately send it to the doctor right from here included. If you are an ardent fan of regular check-ups of your body and are worried about your health, this thing will be indispensable for you",
      photo: '/catalog/_ec3e0165-f360-4a44-8222-637bd57b2f3e.jpg',
      price: 14999,
      rating: 3.9,
      availableQuantity: 4,
    },
    {
      id: 'Creamy-Orange-Cat-Bed',
      category: 'beds',
      title: 'Creamy Orange Cat Bed',
      description:
        'If you like this bed, you have excellent taste. A creamy orange cat bed with a headboard that also features cat ears. The highest quality frame manufacturing, the softness and strength of the mattress included in the price, a unique design, you will get all this by purchasing this bed',
      photo: '/catalog/_ed3b423e-3868-479b-876b-bbf5567de931.jpg',
      price: 3799,
      rating: 4.6,
      availableQuantity: 41,
    },
    {
      id: 'Tall-Creamy-Rabbit-Bed',
      category: 'beds',
      title: 'Tall Creamy Rabbit Bed',
      description:
        'If your ceilings are more than 3 meters you are lucky, as you can fit this amazing rabbit  bed in your apartment',
      photo: '/catalog/_ee64a76a-ed90-433c-8aae-06e1dff865b3.jpg',
      price: 4599,
      sale: 4099,
      rating: 5,
      availableQuantity: 3,
    },
    {
      id: 'Cyberpunk-Series-Mobile-Cubic-Bedroom',
      category: 'beds',
      title: 'Cyberpunk Series Mobile Cubic Bedroom',
      description:
        'Hello world from 2077. This is a full-fledged bedroom of compact dimensions in the form of a cube 2.5m x 2.5m x 2.5m. You can mount it in your motorhome or simply attach it to your truck and ride around the world in comfort and with all the necessary digital technologies within walking distance. High-speed Internet, computer, a complex of sensors included in the smart home system, massage, temperature and transform modes in the bed. Of course everything is included here',
      photo: '/catalog/_efb054e3-a521-4ee4-9156-09f8796ada28.jpg',
      price: 13999,
      rating: 4.9,
      availableQuantity: 16,
    },
    {
      id: 'Totoro-Series-Rounded-Ottoman-Bed',
      category: 'beds',
      title: 'Totoro Series Rounded Ottoman Bed',
      description:
        'Totoro (Japanese: トトロ) is an anime character, guardian of the forest, a large fluffy gray creature. This bed is made in the shape of this character. Soft and fluffy. Suitable for both bedroom and nursery',
      photo: '/catalog/_f8ffc917-6585-42c6-b031-823fdc19d632.jpg',
      price: 2999,
      rating: 4.5,
      availableQuantity: 33,
    },
    {
      id: 'White-Ginger-Corgi-Bed',
      category: 'beds',
      title: 'White Ginger Corgi Bed',
      description:
        'The Corgi is a miniature shepherd dog that helped Welsh peasants herd sheep, goats, ponies and even poultry. Thanks to its short stature, the corgi was able to deftly dodge horns and hooves. Since Corgis do not tend to bark much, these dogs accompanied and guarded poultry without scaring them. Our bed is made in the form of one of these',
      photo: '/catalog/_f95cf3f5-5e0b-4493-a3a2-8da0b9bd5d1d.jpg',
      price: 3399,
      rating: 4.9,
      availableQuantity: 23,
    },
    {
      id: 'Classic-Series-Grey-White-Rounded-Cat-Bed',
      category: 'beds',
      title: 'Classic Series Grey White Rounded Cat Bed',
      description:
        'This model of our classic is made with a very realistic face of the most ordinary gray and white cat',
      photo: '/catalog/_f95dfca6-7a3b-4451-a564-1b304a70f995.jpg',
      price: 3799,
      rating: 4.2,
      availableQuantity: 6,
    },
    {
      id: 'Stitch-Series-Thematic-Bed',
      category: 'beds',
      title: 'Stitch Series Thematic Bed',
      description:
        'Stitch is the name of genetic experiment 626, the main character of the Lilo and Stitch franchise. Stitch is a fictional alien, originally created to create great chaos in the galaxy and various cities. He is distinguished by his exceptional temper and destructive behavior, which, nevertheless, the earthly girl Lilo manages to tame, who took him as her little bundle of happiness. You can take your own You can place an order and take your own stitch too',
      photo: '/catalog/_fb790ff1-0b03-4c4e-a04d-b0d200b98dcb.jpg',
      price: 2399,
      rating: 4.2,
      availableQuantity: 32,
    },
    {
      id: 'Biscuit-Teddy-Bear-Bed',
      category: 'beds',
      title: 'Biscuit Teddy Bear Bed',
      description:
        'A bed in the shape of a bear in a delicate biscuit color. Due to its universal dimensions, this is an excellent sleeping place for both children and adults',
      photo: '/catalog/_fc5af8bb-d051-4b8e-9103-f60b2626f142.jpg',
      price: 2699,
      rating: 3,
      availableQuantity: 23,
    },
    {
      id: 'Soft-Yellow-Plush-Cat-Bed',
      category: 'beds',
      title: 'Soft Yellow Plush Cat Bed',
      description:
        'Bed in the shape of a gentle yellow kitten. Due to its universal dimensions, this is an excellent sleeping place for both children and adults',
      photo: '/catalog/_fee97849-d3fb-485a-bc8f-dbb730434d99.jpg',
      price: 2699,
      rating: 3.1,
      availableQuantity: 12,
    },
    {
      id: 'Stitch-Series-Ottoman-Bed',
      category: 'beds',
      title: 'Stitch Series Ottoman Bed',
      description:
        "The same favorite of children from the cartoon Stitch. Now in the form of an ottoman bed. The sizes are universal, it will perfectly fit in the bedroom or in the children's room",
      photo: '/catalog/_19125600-ae1d-4120-bc1e-8e9358edf9a0.jpg',
      price: 3499,
      rating: 3.2,
      availableQuantity: 4,
    },
    {
      id: 'Creamy-Biscuit-Owl-Bed',
      category: 'beds',
      title: 'Creamy Biscuit Owl Bed',
      description:
        'Gorgeous beautiful owl in your bedroom. Only high-quality materials, soft upholstery and a thick, practical mattress. This bed is worth it...',
      photo: '/catalog/_ac25c9e4-74db-4ad9-b828-a8b373983f68.jpg',
      price: 2899,
      sale: 2699,
      rating: 3.1,
      availableQuantity: 2,
    },
    {
      id: 'Stitch-Series-Ottoman-Bed-V2',
      category: 'beds',
      title: 'Stitch Series Ottoman Bed V2',
      description:
        'Stitch was created by the evil genius Jumba Jookieba, who named him "Experiment 626". It was created from the genes of the most powerful and dangerous creatures in the galaxy, which were connected together with electricity to begin the formation of molecules and the process of creating a body. Our ottoman bed in the form of this cute creature is also a kind of experiment that has incorporated the best materials that have no analogues in softness and practicality.',
      photo: '/catalog/_0b72ad45-23df-4146-a27d-f5cc01143e76.jpg',
      price: 3999,
      rating: 3.3,
      availableQuantity: 4,
    },
    {
      id: 'Sea-Series-Luxurious-Lavender-Coral-Garden-Sofa',
      category: 'sofas',
      title: 'Sea Series Luxurious Lavender Coral Garden Sofa',
      description:
        'A real coral garden located in your living room. Finely crafted coral in soft, tactile materials frames your living room sofa. A dream for many underwater lovers',
      photo: '/catalog/_0b10cc03-f722-4d0b-836a-25c7d30ed8a6.jpg',
      price: 3199,
      rating: 4.8,
      availableQuantity: 14,
    },
    {
      id: 'Sea-Series-Coral-Pink-Colored-Crab-Sofa',
      category: 'sofas',
      title: 'Sea Series Coral Pink Colored Crab Sofa',
      description:
        'Highly detailed designer sofa in coral color with crab theme with a claw. Fits perfectly into Art Nouveau interiors in soft pastel shades',
      photo: '/catalog/_0d8dd284-6199-4935-a7f9-eea8affadbd7.jpg',
      price: 2499,
      rating: 4.9,
      availableQuantity: 53,
    },
    {
      id: 'Raspberry-Marmalade-Sofa',
      category: 'sofas',
      title: 'Raspberry Marmalade Sofa',
      description:
        'A sofa in the shape of those sweet Haribo gummies that your children constantly ask for',
      photo: '/catalog/_1f13c476-bb30-40fa-b76e-3e6001598981.jpg',
      price: 2199,
      rating: 3.2,
      availableQuantity: 6,
    },
    {
      id: 'Matting-Light-Grey-Cat-Divan',
      category: 'sofas',
      title: 'Matting Light Grey Cat Divan',
      description:
        'High-quality sofa stylized as a cat. On the back there are ears and a nose in front, as well as paws in a kind of poufs on which you can rest your feet... Made of gray matting',
      photo: '/catalog/_2ba83e60-830c-4e65-9b7a-41e0870d74d6.jpg',
      price: 1399,
      rating: 4.6,
      availableQuantity: 2,
    },
    {
      id: 'Classic-Series-Violet-Cat-Sofa',
      category: 'sofas',
      title: 'Classic Series Violet Cat Sofa',
      description:
        "This sofa, like our beds from the classic series, has a cat's face on the headboard. This one is made in purple color",
      photo: '/catalog/_3b903d3c-e822-40c3-a13f-611e4d5a9a2d.jpg',
      price: 2099,
      rating: 4.3,
      availableQuantity: 6,
    },
    {
      id: 'Sea-Series-White-Dolphin-Sofa',
      category: 'sofas',
      title: 'Sea Series White Dolphin Sofa',
      description:
        'Fluffy soft sofa in the shape of a white dolphin. The design is thought out to the smallest detail. Fits perfectly into any Art Nouveau apartment',
      photo: '/catalog/_4e1ca439-9291-4bdc-b611-d7f6c86d400e.jpg',
      price: 2299,
      rating: 5,
      availableQuantity: 76,
    },
    {
      id: 'Light-Creamy-Banana-Corner-Sofa',
      category: 'sofas',
      title: 'Light Creamy Banana Corner Sofa',
      description:
        'A corner sofa stylized as a banana is perfect for both the living room and the kitchen area at the dining table',
      photo: '/catalog/_5bda4ffc-adb9-435a-a56b-090bdcf559bc.jpg',
      price: 1999,
      rating: 4.9,
      availableQuantity: 45,
    },
    {
      id: 'White-Sheep-Wool-Sofa',
      category: 'sofas',
      title: 'White Sheep Wool Sofa',
      description:
        "Sofa made of natural sheep wool. So fluffy it looks like it hasn't been cut since birth until old age",
      photo: '/catalog/_5fda611b-b0df-4555-9a2b-d568f6fccddb.jpg',
      price: 1399,
      rating: 3,
      availableQuantity: 3,
    },
    {
      id: 'Cyberpunk-Series-Trader-Sofa',
      category: 'sofas',
      title: 'Cyberpunk Series Trader Sofa',
      description:
        'In the modern world, traders perform a huge number of transactions on the stock exchange per month. They work both to increase and decrease the exchange rate of a currency or the value of securities, and sometimes they are willing to risk their entire capital for great profit. Next to this coral-colored sofa there is everything you need in the kit so that you can risk big bucks without taking your butt off the sofa',
      photo: '/catalog/_6b34619d-8749-4080-be05-2c7fd1eaa31f.jpg',
      price: 4199,
      rating: 4.9,
      availableQuantity: 4,
    },
    {
      id: 'Big-Smug-Frog-Sofa',
      category: 'sofas',
      title: 'Big Smug Frog Sofa',
      description:
        'This frog was inspired by memes about his relative and decided to take his place by sitting on with a smug wide smile. At a time when one deceived Pepe is sad somewhere, you need to make the main choice in your life - whether to take this impostor, smug face home. Make sure your ceiling heights match it',
      photo: '/catalog/_7b2bb3c2-7630-421c-8bca-92067c9ebbb1.jpg',
      price: 4499,
      rating: 4.8,
      availableQuantity: 2,
    },
    {
      id: 'Classic-White-Brown-Owl-Sofa',
      category: 'sofas',
      title: 'Classic White Brown Owl Sofa',
      description:
        "This small owl will fit into almost any room, maybe a nursery. The quality is top notch as always. Manufacturer's warranty",
      photo: '/catalog/_7db8a337-f9b7-4cd3-8fca-bf0f4aa07bd0.jpg',
      price: 1999,
      rating: 3.9,
      availableQuantity: 6,
    },
    {
      id: 'Sea-Series-Light-Beige-Stingray-Sofa',
      category: 'sofas',
      title: 'Sea Series Light Beige Stingray Sofa',
      description:
        'The stingray has been transformed into a bed to give you comfort and coziness in your home for many years.',
      photo: '/catalog/_7f15d66b-c0ec-43bc-a769-f2bf8f4633b7.jpg',
      price: 1599,
      rating: 4.4,
      availableQuantity: 4,
    },
    {
      id: 'Black-Caviar-Sofa',
      category: 'sofas',
      title: 'Black Caviar Sofa',
      description:
        'An integral part of the table of rich gourmets and oligarchs who love to live large is black caviar. If you are a lover and fan of this expensive delicacy, this sofa made in the style of bubbles of such caviar will bring you delight and you will buy it for any money, because you can afford it',
      photo: '/catalog/_8c6afda4-e4d2-4198-b46a-c115d81e2361.jpg',
      price: 9999,
      rating: 4.6,
      availableQuantity: 76,
    },
    {
      id: 'Sea-Series-Luxurious-Lavender-Coral-Garden-Sofa-V2',
      category: 'sofas',
      title: 'Sea Series Luxurious Lavender Coral Garden Sofa V2',
      description:
        'A coral garden of unprecedented beauty in your home. The big plus is that they are soft, unlike the ones you injured yourself on while diving drunk in Egypt',
      photo: '/catalog/_8d2e8727-12e8-4ce1-b134-9d04cd65726b.jpg',
      price: 5999,
      rating: 4.9,
      availableQuantity: 4,
    },
    {
      id: 'Sea-Series-Light-Beige-Stingray-Sofa-V2',
      category: 'sofas',
      title: 'Sea Series Light Beige Stingray Sofa V2',
      description:
        'A more modern design compared to the first version of the stingray bed. The quality is as good as ever',
      photo: '/catalog/_9acceb0b-2a36-49e6-8d85-4997c0efdf49.jpg',
      price: 1999,
      rating: 4.9,
      availableQuantity: 56,
    },
    {
      id: 'Sea-Series-Light-Beige-Octopus-Sofa',
      category: 'sofas',
      title: 'Sea Series Light Beige Octopus Sofa',
      description:
        'A curled up light beige octopus is looking forward to your purchase and is ready to bring you comfort and coziness in your home for many years',
      photo: '/catalog/_9f060563-43ac-428f-b8ea-29e34327ac37.jpg',
      price: 1899,
      sale: 1799,
      rating: 4.6,
      availableQuantity: 3,
    },
    {
      id: 'Sea-Series-Orange-Bottom-Grey-Stingray-Sofa',
      category: 'sofas',
      title: 'Sea Series Orange Bottom Grey Stingray Sofa',
      description:
        'This tramp swam seas and oceans before he got to our store and is really waiting until you take him home',
      photo: '/catalog/_14acdd46-8c9a-4006-bc90-19cef10d20c3.jpg',
      price: 1799,
      rating: 4.7,
      availableQuantity: 4,
    },
    {
      id: 'Sea-Series-Lavender-Coral-Garden-Sofa-With-Pouf',
      category: 'sofas',
      title: 'Sea Series Lavender Coral Garden Sofa With Pouf',
      description:
        'A highly detailed sofa with a coral style in lavender color, and even with a pouf included. Definitely a good offer',
      photo: '/catalog/_018a0a91-6923-4e55-9bfe-88b183f65876.jpg',
      price: 2399,
      rating: 3.8,
      availableQuantity: 5,
    },
    {
      id: 'Classic-Series-Fluffy-White-Cat-Sofa',
      category: 'sofas',
      title: 'Classic Series Fluffy White Cat Sofa',
      description:
        'Very realistic and detailed work of our craftsmen. As if a real braid looking out from the back of this sofa will be an unusual and original solution to complement any interior of your home or apartment',
      photo: '/catalog/_21ddb75e-b3eb-483d-8b16-3f0be8688910.jpg',
      price: 2299,
      sale: 1999,
      rating: 4.9,
      availableQuantity: 34,
    },
    {
      id: 'Sea-Series-White-Stingray-Sofa',
      category: 'sofas',
      title: 'Sea Series White Stingray Sofa',
      description:
        'Dedicated to lovers of sea reptiles. Sofa stylized as a stingray. Very comfortable and soft like other items in our store',
      photo: '/catalog/_21e3ab52-c812-4053-bc46-1e2e698548fb.jpg',
      price: 1799,
      rating: 5,
      availableQuantity: 2,
    },
    {
      id: 'Dragonfruit-Sofa',
      category: 'sofas',
      title: 'Dragonfruit Sofa',
      description:
        'Sofa in the shape of a Thai exotic fruit - pitaya or dragonfruit',
      photo: '/catalog/_27b6f7b2-0410-4ae8-a9f1-5041d3b550f3.jpg',
      price: 1599,
      rating: 4.2,
      availableQuantity: 44,
    },
    {
      id: 'Soft-Orange-Giraffe-Sofa',
      category: 'sofas',
      title: 'Soft Orange Giraffe Sofa',
      description:
        'The giraffe sofa is a soft pastel orange color. For lovers of African fauna and unique Exotic Beds design',
      photo: '/catalog/_76cdb5ad-c9e7-40bf-9bd6-fa5989661158.jpg',
      price: 1999,
      sale: 1599,
      rating: 5,
      availableQuantity: 4,
    },
    {
      id: 'Light-Beige-Pug-Sofa',
      category: 'sofas',
      title: 'Light Beige Pug Sofa',
      description:
        "Just look at this cutie. a soft and fluffy pug is just asking to come home to you. Such a realistic appearance of a pug is a consequence of our craftsmen's attention to detail and the high quality of the materials we use",
      photo: '/catalog/_84bdbce5-1cc3-4a71-bbd5-c501cb09923b.jpg',
      price: 1999,
      sale: 1699,
      rating: 4.3,
      availableQuantity: 4,
    },
    {
      id: 'Sea-Series-Pastel-Orange-Eco-Leather-Crab-Sofa',
      category: 'sofas',
      title: 'Sea Series Pastel Orange Eco Leather Crab Sofa',
      description:
        "This sofa thinks it's an orange crab. Don't worry, it's tame and won't pinch. Made from high quality eco leather",
      photo: '/catalog/_90b4035c-c551-4731-8a79-ee79936a82b7.jpg',
      price: 2199,
      sale: 1499,
      rating: 4.9,
      availableQuantity: 54,
    },
    {
      id: 'Sea-Series-Gigantic-Whale-Shark-Sofa',
      category: 'sofas',
      title: 'Sea Series Gigantic Whale Shark Sofa',
      description:
        'If you have been to the Maldives, you may have seen these huge beauties and were so impressed that now you go buy such a sofa in the form of one of them and take up most of your living room with it. We give you this chance',
      photo: '/catalog/_450bf8a7-0a34-413f-b80e-3a823e14368d.jpg',
      price: 6599,
      sale: 5999,
      rating: 5,
      availableQuantity: 32,
    },
    {
      id: 'White-Plush-Toothy-Dolphin-Sofa',
      category: 'sofas',
      title: 'White Plush Toothy Dolphin Sofa',
      description:
        'This dude must be brushing his shiny teeth 4 times a day and whitening them. In any case, such a handsome man will perfectly emphasize your taste and the design of your apartment in the Art Nouveau design or any other',
      photo: '/catalog/_921a61da-b28e-4da0-bf29-7e50f81d27f3.jpg',
      price: 1999,
      sale: 1899,
      rating: 4.9,
      availableQuantity: 7,
    },
    {
      id: 'Biscuit-Mushroom-Sofa',
      category: 'sofas',
      title: 'Biscuit Mushroom Sofa',
      description:
        "Don't worry, that is not mushroom cloud effect of Nuclear Weapons behind you, it's just a sofa designed by Exotic Beds with a huge biscuit mushroom in addition",
      photo: '/catalog/_4126d311-cdde-40c7-a2f3-af678f451beb.jpg',
      price: 2599,
      rating: 3.1,
      availableQuantity: 42,
    },
    {
      id: 'Ashy-Iguana-Statue-Sofa',
      category: 'sofas',
      title: 'Ashy Iguana Statue Sofa',
      description:
        'This iguana looks like a work of art. All thanks to our craftsmen. The sofas themselves are the second reason why people prefer our products, the first is a unique art object that they represent',
      photo: '/catalog/_5279f908-1981-48c6-8f3e-c90af213397d.jpg',
      price: 5299,
      sale: 4299,
      rating: 4.2,
      availableQuantity: 1,
    },
    {
      id: 'Beige-Crocodile-Sofa',
      category: 'sofas',
      title: 'Beige Crocodile Sofa',
      description:
        'Soft and fluffy sofa with a crocodile face. This item will be a unique addition to the design of your apartment',
      photo: '/catalog/_7671f76a-577e-4eb4-86d7-c73dd05a1561.jpg',
      price: 3799,
      sale: 1799,
      rating: 4.9,
      availableQuantity: 4,
    },
    {
      id: 'Cyberpunk-Series-Party-Maker-Sofa',
      category: 'sofas',
      title: 'Cyberpunk Series Party Maker Sofa',
      description:
        'Sofa of the future equipped with super loud and bassy speakers with equipment for fine-tuning the sound... Super sound and ultra bass guaranteed',
      photo: '/catalog/_1592492e-e27e-4b9d-a2dc-e46f41fdcd7e.jpg',
      price: 2999,
      rating: 4.5,
      availableQuantity: 6,
    },
    {
      id: 'Light-Beige-Frog-Sofa',
      category: 'sofas',
      title: 'Light Beige Frog Sofa',
      description:
        'Flock sofa with frog eyes and legs made of the most durable and soft materials',
      photo: '/catalog/_11523106-bf86-464f-ae5a-5a3e3d475bde.jpg',
      price: 2599,
      sale: 1999,
      rating: 4.1,
      availableQuantity: 3,
    },
    {
      id: 'Bubbled-Ashy-Cat-Eared-Sofa',
      category: 'sofas',
      title: 'Bubbled Ashy Cat Eared Sofa',
      description:
        'Very soft sofa with cat ears in ash color, made in bubbles shape',
      photo: '/catalog/_37294321-0b37-448b-a9a6-98aa6abaf29b.jpg',
      price: 1599,
      sale: 1399,
      rating: 3,
      availableQuantity: 5,
    },
    {
      id: 'Beige-Green-Mushroom-Sofa',
      category: 'sofas',
      title: 'Beige Green Mushroom Sofa',
      description:
        'A soft bed equipped with a large mushroom that stands on it. Imagine yourself as a bug in a mushroom forest and relax on such a miracle',
      photo: '/catalog/_72770348-ba52-410f-b0e4-0a71eb43b637.jpg',
      price: 1999,
      rating: 2.1,
      availableQuantity: 34,
    },
    {
      id: 'Mustard-Yoda-Sofa',
      category: 'sofas',
      title: 'Mustard Yoda Sofa',
      description:
        'The same Yoda from Star Wars can be placed in your living room and create mood and comfort in your home',
      photo: '/catalog/_ab629230-f691-47c5-bb97-3c17a2363d8e.jpg',
      price: 2199,
      rating: 3.4,
      availableQuantity: 3,
    },
    {
      id: 'Pink-Bubbled-Teddy-Bear-Sofa',
      category: 'sofas',
      title: 'Pink Bubbled Teddy Bear Sofa',
      description:
        'Bubble-shaped sofa with a back in the shape of a soft teddy bear. Will be a great addition to an interior with delicate pastel shades',
      photo: '/catalog/_ac8c5c3c-86d8-45ea-86fa-652ce7356e4f.jpg',
      price: 2199,
      rating: 3.9,
      availableQuantity: 4,
    },
    {
      id: 'Sea-Series-Whale-Shark-Sofa',
      category: 'sofas',
      title: 'Sea Series Whale Shark Sofa',
      description:
        "The whale shark lives in the warm waters of tropical climates throughout the world's oceans. But it can also live in your apartment if you want. Any whim will be fulfilled by the EB",
      photo: '/catalog/_afa488d4-35c8-4163-9ca0-e856c83775c7.jpg',
      price: 3399,
      sale: 3199,
      rating: 4.9,
      availableQuantity: 3,
    },
    {
      id: 'Mustard-Plush-Pineapple-Sofa',
      category: 'sofas',
      title: 'Mustard Plush Pineapple Sofa',
      description:
        'This plush sofa is made in the shape of a pineapple and is completely in mustard color. If you like him, you have good taste',
      photo: '/catalog/_b01fdc99-ed44-4bab-b471-f13b8412c4d2.jpg',
      price: 1999,
      rating: 4.7,
      availableQuantity: 5,
    },
    {
      id: 'Green-Yoda-Sofa',
      category: 'sofas',
      title: 'Green Yoda Sofa',
      description:
        'Yoda is one of the main characters of Star Wars, Grand Master of the Jedi Order, one of the strongest and wisest Jedi of his time. Our sofa is designed like him. Completely in green',
      photo: '/catalog/_b07af274-e072-4676-9abe-e71b6c01cb31.jpg',
      price: 2199,
      rating: 3.5,
      availableQuantity: 5,
    },
    {
      id: 'Creamy-Beige-Yoda-Sofa',
      category: 'sofas',
      title: 'Creamy Beige Yoda Sofa',
      description:
        'Master Yoda was 900 years old, middle-aged by the standards of his race. Our bed is of such high quality that it will serve you for the same number of years',
      photo: '/catalog/_b4662585-59d0-4a3e-aae6-cd27f33ce915.jpg',
      price: 2299,
      sale: 1999,
      rating: 4,
      availableQuantity: 4,
    },
    {
      id: 'Creamed-Yellow-Banana',
      category: 'sofas',
      title: 'Creamed Yellow Banana',
      description:
        'This sofa looks like cream and banana, as always an original solution from our craftsmen. It looks very beautiful and appetizing, it makes you hungry for real',
      photo: '/catalog/_bd79d145-fd4b-414a-b671-4c8064dfb57b.jpg',
      price: 1999,
      rating: 4.2,
      availableQuantity: 53,
    },
    {
      id: 'Pokemon-Series-Slowpoke',
      category: 'sofas',
      title: 'Pokemon Series Slowpoke',
      description:
        "Now there's a sofa in the shape of the cutest pink Pokemon Slowpoke",
      photo: '/catalog/_bf26adee-aa01-4657-953b-59249ce62c05.jpg',
      price: 2299,
      rating: 3.5,
      availableQuantity: 5,
    },
    {
      id: 'Light-Mustard-Crocodile-Sofa',
      category: 'sofas',
      title: 'Light Mustard Crocodile Sofa',
      description:
        'Sharp fangs and an ominous grin and at the same time unsurpassed softness and comfort. All this about our crocodile sofa',
      photo: '/catalog/_c8fb029d-0f02-4eba-81ee-e5918ddf9759.jpg',
      price: 2199,
      rating: 3.9,
      availableQuantity: 56,
    },
    {
      id: 'Dragonfruit-Sofa-V2',
      category: 'sofas',
      title: 'Dragonfruit Sofa V2',
      description:
        'Sofa in the shape of an exotic dragonfruit in its juicy and bright colors',
      photo: '/catalog/_c7191834-23b2-451a-a9e8-86ba101b2abe.jpg',
      price: 1699,
      rating: 4.9,
      availableQuantity: 6,
    },
    {
      id: 'Fluffy-Violet-Eared-Cat-Sofa',
      category: 'sofas',
      title: 'Fluffy Violet Eared Cat Sofa',
      description:
        'Purple sofa made of very soft and fluffy materials with cute cat ears on the back and paws at the bottom',
      photo: '/catalog/_ca2b63b8-10d1-4ca3-bd67-b10916b02871.jpg',
      price: 2399,
      rating: 4.3,
      availableQuantity: 67,
    },
    {
      id: 'Cyberpunk-Series-Massage-Sofa',
      category: 'sofas',
      title: 'Cyberpunk Series Massage Sofa',
      description:
        'Massage from 2077 looks something like this. A sofa with 200 different massage modes from relaxing to acupuncture. All displays and panels with settings included',
      photo: '/catalog/_cbab7c90-e41d-4516-9841-018775c10016.jpg',
      price: 3399,
      rating: 5,
      availableQuantity: 32,
    },
  ],
  mapViewState: {
    latitude: 52.8,
    longitude: 58.4,
    zoom: 3,
  },
  nearStoresCenter: { latitude: 55.751244, longitude: 37.618423 },
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loadProducts, (state, action) => {
      state.products = action.payload;
    })
    .addCase(productsAreLoaded, (state, action) => {
      state.products = action.payload;
    })
    .addCase(cartOpen, (state, action) => {
      state.isCartOpen = action.payload;
    })
    .addCase(addProductToCart, (state, action) => {
      state.cartProducts = getCartWithAddedProduct(state, action);
    })
    .addCase(removeProductFromCart, (state, action) => {
      state.cartProducts = state.cartProducts.filter(
        (product) => product.id !== action.payload
      );
    })
    .addCase(increaseProductAmountInCart, (state, action) => {
      state.cartProducts = getCartWithIncreasedProduct(state, action);
    })
    .addCase(decreaseProductAmountInCart, (state, action) => {
      state.cartProducts = getCartWithDecreasedProduct(state, action);
    })
    .addCase(toggleProductInLovelist, (state, action) => {
      state.lovelistProducts = updateLovelist(state, action);
    })
    .addCase(setMapViewState, (state, action) => {
      state.mapViewState = action.payload;
    })
    .addCase(setNearStoresCenter, (state, action) => {
      state.nearStoresCenter = action.payload;
    });
});

export { reducer };
