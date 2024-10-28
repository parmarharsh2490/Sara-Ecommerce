import  { Key, useEffect, useRef, useState } from 'react'
import Navigation from '../../components/shared/Navigation';
import Footer from '../../components/shared/Footer';
import PromotionBanner from '../../components/shared/PromotionBanner';
import Reviews from '../../components/shared/Reviews';
import { useGetAllProducts, useGetProductDetails } from '../../query/ProductQueries';
import { useNavigate, useParams } from 'react-router-dom';
import { ISizeOption, IVariety } from '@/types';
import { useAddToWishlist } from '../../query/WishlistQueries';
import { useAddToCart } from '../../query/CartQueries';
import ProductList from '../../components/shared/ProductList';
import { useToast } from '@/hooks/use-toast';
import { useInfiniteQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/query/queryKeys';
import { getAllProducts } from '@/services/productService';
import { MdProductionQuantityLimits } from 'react-icons/md';
import { allProducts } from '@/utils/allProducts';


const ProductSkeleton = () => {
  return (
    <div className='h-full'>
    <section id="prodetails" className="p-5 sm:px-10 flex flex-col sm:flex-row w-full  items-center h-[70%]">
        <div className='h-full w-full sm:w-[35%] flex justify-center items-center sm:gap-2 flex-col-reverse sm:flex-row '>
            <div className='flex gap-1 justify-center items-center flex-row sm:flex-col w-full sm:w-[20%] mt-1'>
                <div className='w-[24%] sm:w-full bg-slate-200 animate-pulse h-[5.7rem] ' />
                <div className='h-[5.7rem] w-[24%] bg-slate-200 animate-pulse sm:w-full' />
                <div className='h-[5.7rem] w-[24%] bg-slate-200 animate-pulse sm:w-full' />
                <div className='h-[5.7rem] bg-slate-200 animate-pulse w-[24%] sm:w-full  ' />
            </div>
            <div className='w-full h-[350px]  sm:w-80 sm:h-[420px] bg-slate-200 animate-pulse'></div>
        </div>
        <div className=" w-full sm:w-[65%] mt-7 sm:px-12 pt-30">
            <h6 className="text-xl font-semibold my-2 h-5 w-28 bg-slate-200 animate-pulse rounded-md"></h6>
            <h4 className="text-3xl my-2  h-7 w-40 bg-slate-200 animate-pulse rounded-md"></h4>
            <h2 className="text-2xl my-2  h-7 w-24 bg-slate-200 animate-pulse rounded-md"></h2>
            <div className="block py-2 px-4 mb-4 border border-gray-300 focus:outline-none  h-7 w-32 bg-slate-200 animate-pulse rounded-md">
            </div>
            <div className="focus:outline-none w-14 border border-1 mr-3 p-2  h-5 bg-slate-200 animate-pulse rounded-md inline-block" />
            <button className=' sm:w-1/4 p-2  hover:bg-slate-600  duration-500  
  h-10 w-44 bg-slate-200 animate-pulse rounded-md
'></button>
            <h4 className="text-2xl py-4  h-7 w-32 bg-slate-200 animate-pulse rounded-md my-3"></h4>
            <div className="min-h-[100px] max-w-[400px] bg-slate-200 animate-pulse rounded-md"></div>
        </div>
    </section>
</div>
  );
};

const ProductDetails = () => {
  const {toast} = useToast();
  const {productId} = useParams();
  if(!productId){
    return <p>Error Happened!</p>
  }
  const [selectedVarietyIndex,setSelectedVarietyIndex] = useState(0)
  const [selectedSizeOptionIndex,setSelectedSizeOptionIndex] = useState(0)
  const [selectedImageIndex,setSelectedImageIndex] = useState(0);
  const {mutateAsync : addToWishlist} = useAddToWishlist();
  const {mutateAsync : addToCart,isPending : isAddingToCartPending} = useAddToCart();
  const navigate = useNavigate();
    const productCount = useRef<HTMLInputElement>(null);
    const {data : product,isLoading,isPending,isFetched,isSuccess} = useGetProductDetails(productId);
    const [options,setOptions] = useState({category : product?.category,enabled : !!product?.category,pageParam : 0});
    const {data : products,isFetching,isFetchingNextPage,error : isFetchingProductsError,fetchNextPage} = useInfiniteQuery({
      queryKey : [QUERY_KEYS.PRODUCTS,options],
      queryFn : ({ pageParam = 0 }) => getAllProducts({ ...options, pageParam }),
      initialPageParam : 0,
      getNextPageParam : (lastPage, allPages) => {
        console.log(allPages);
        
        const nextPage = allPages.length || 10;
        console.log(nextPage);
        
        return nextPage;
      }
    })
    useEffect(() => {
      if (product?.category) {
        setOptions(prev => ({
          ...prev,
          category: product.category,
          enabled: true
        }));
      }
    }, [product]);
    
    console.log(product);
    const loadMore  = () => {
      fetchNextPage()
    } 
    
const handleAddToCart = async({productId,sizeOptionId,varietyId,quantity} : {productId : any,sizeOptionId: any,varietyId: any,quantity : any}) => {
  console.log(productId);
  try {
    if(product.isAlreadyInCart){
      navigate('/checkout/cart')
      return
    }
    await addToCart({ productId,sizeOptionId,varietyId,quantity});
    product.isAlreadyInCart = true;  
   toast({title : "Success",description : "Successfully Added to Cart",variant : "cart"}) 
  } catch (error) {
  toast({title : "Failed",description : "Failed to Add to Cart",variant : "destructive"})   
  }
}
const handleAddToWishlist = async({productId,sizeOptionId,varietyId} : {productId : any,sizeOptionId: any,varietyId: any,quantity : any}) => {
  console.log(productId);
  
  
  try {
    await addToWishlist({ productId , sizeOptionId , varietyId})
   toast({title : "Success",description : "Successfully Added to Wishlist",variant : "wishlist"}) 
  } catch (error) {
  toast({title : "Failed",description : "Already in Wishlist",variant : "destructive"})   
  }
}
const imageClick = (indexOfImage: number) => {
  setSelectedImageIndex(indexOfImage)
};
  return (
    <>
    {
      isLoading || isPending || !isFetched || !isSuccess? (
        <ProductSkeleton/>
      ) : (
        <>
          <Navigation/>
    {
      product && (
        <section
      id="prodetails"
      className="gap-10 p-5 sm:px-10 flex flex-col sm:flex-row w-full items-center justify-center h-[70%]"
    >
      <div className="h-full w-full sm:w-[70%] md:w-[55%] lg:w-[35%] flex items-center   flex-col-reverse md:flex-row">
        <div className="flex gap-2 justify-center items-center flex-row md:flex-col w-full md:w-[20%] mt-1">
        {product.variety[selectedVarietyIndex].images.map((image: { imageUrl: string }, imageIndex: Key | null | undefined) => (
              <img
                key={imageIndex}
                src={image?.imageUrl}
                onClick={() => imageClick(imageIndex as number)}
                className="hover:scale-105 duration-500 sm:w-[100%] w-[25%] max-w-[70px] bg-cover"
                alt={`Product Thumbnail ${imageIndex as number + 1}`}
                // className='w-[50px]'
              />
            ))}
        </div>
        <img
          src={product.variety[selectedVarietyIndex].images[selectedImageIndex].imageUrl}
          className="w-full  sm:w-[100%] max-w-[70%] h-full cursor-pointer bg-cover p-2"
          alt="Main Product"
        />
      </div>
      <div className="w-full sm:w-[65%] mt-7  pt-30">
        <h6 className="text-md   md:text-2xl font-semibold my-2">Home / men-shirts</h6>
        <h4 className="sm:text-lg md:text-3xl text-2xl my-2">
          {product.title}
        </h4>
        <div className="flex justify-start items-center">
          <h2 className="text-2xl sm:text-base md:text-2xl my-2 font-semibold">₹{product.variety[selectedVarietyIndex].sizeOptions[selectedSizeOptionIndex].price.discountedPrice}</h2>
          <s className="mr-1 text-slate-400 mx-2 text-base">₹{product.variety[selectedVarietyIndex].sizeOptions[selectedSizeOptionIndex].price.originalPrice}</s>
          <p className="font-bold my-1 text-green-600 text-base">(18% off)</p>
        </div>
        <select className="block py-2 px-4 mb-4 bg-white border border-gray-300 focus:outline-none">

        <option key={product.variety[selectedVarietyIndex].sizeOptions[selectedSizeOptionIndex].size} value={product.variety[selectedVarietyIndex].sizeOptions[selectedSizeOptionIndex].size} >
    {product.variety[selectedVarietyIndex].sizeOptions[selectedSizeOptionIndex].size} 
    </option>
          {
  product.variety[selectedVarietyIndex].sizeOptions.map((sizeOption: ISizeOption, sizeOptionIndex: number) => (
    sizeOptionIndex !== selectedSizeOptionIndex && <option key={sizeOption.size} onClick={() => {
      setSelectedSizeOptionIndex(sizeOptionIndex);
      console.log(selectedSizeOptionIndex);
      
    }} value={sizeOption.size}>
    {sizeOption.size}
    </option>
  ))
}
        </select>
        <input
          type="number"
          className="focus:outline-none w-14 border border-1 mr-3 p-2"
          ref={productCount}
          min={0}
          max={999}
        />
        <div className='flex gap-4 items-center justify-start mt-2'>
          {
            product.variety.map((variety: IVariety, varietyIndex: number) => (
              <button className='bg-gray-200 rounded-lg px-4 py-2 text-blue-600' onClick={() => setSelectedVarietyIndex(varietyIndex)}>{variety.color}</button>
            ))
          }
        </div>
        <div className="flex sm:my-2  left-0 bg-white sm:shadow-sm shadow-2xl p-1 gap-1 w-full z-10 fixed sm:relative bottom-0">
          <button onClick={() =>handleAddToWishlist({productId : product._id,sizeOptionId : product.variety[selectedVarietyIndex].sizeOptions[selectedSizeOptionIndex]._id,varietyId :  product.variety[selectedVarietyIndex]._id})} 
            className="w-1/2 max-w-[200px] p-3 mx-2 gap-2 text-base sm:relative  sm:p-0 bg-white text-black border hover:bg-slate-600 duration-500 border-slate-800 hover:text-white flex justify-center items-center rounded-md font-semibold">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M458.4 64.3C400.6 15.7 311.3 23 256 79.3 200.7 23 111.4 15.6 53.6 64.3-21.6 127.6-10.6 230.8 43 285.5l175.4 178.7c10 10.2 23.4 15.9 37.6 15.9 14.3 0 27.6-5.6 37.6-15.8L469 285.6c53.5-54.7 64.7-157.9-10.6-221.3zm-23.6 187.5L259.4 430.5c-2.4 2.4-4.4 2.4-6.8 0L77.2 251.8c-36.5-37.2-43.9-107.6 7.3-150.7 38.9-32.7 98.9-27.8 136.5 10.5l35 35.7 35-35.7c37.8-38.5 97.8-43.2 136.5-10.6 51.1 43.1 43.5 113.9 7.3 150.8z"></path>
            </svg>
            WISHLIST
          </button>
          <button 
          onClick={() => handleAddToCart({ productId: product._id, sizeOptionId: product.variety[selectedVarietyIndex].sizeOptions[selectedSizeOptionIndex]._id, varietyId: product.variety[selectedVarietyIndex]._id, quantity: productCount.current?.value || 1 })}
          className="w-1/2 max-w-[200px] left-0 p-3 text-base sm:relative  sm:p-2 bg-slate-800 text-white border hover:bg-slate-600 rounded-md font-semibold duration-500 border-slate-800 hover:text-white">
            {product.isAlreadyInCart ? "Go To Cart" : (isAddingToCartPending ? "Adding" :"ADD TO BAG")}
          </button>
        </div>
        <h4 className="text-lg py-4">Product details</h4>
        <span className="leading-5 w-full">
          <p>
           {product.description}
          </p>
        </span>
      </div>
    </section>
      )
    } 
    {/* <Reviews/> */}
    <Reviews/>
     <div className='mt-10'>
        <h1 className='text-center text-2xl sm:text-3xl sm:mb-2'>Similar Products</h1>
        <p className='sm:text-base text-sm text-slate-400 text-center mb:1 sm:mb-7'>You may also like</p>
        <ProductList loadMore={loadMore} products={allProducts(products)} buttonLoading={isFetchingNextPage} isError={!!isFetchingProductsError} productLoading={isLoading}/>
    </div> 

    <PromotionBanner/>
     <Footer/>
        </>
      )
    }

    </>
  )
}

export default ProductDetails