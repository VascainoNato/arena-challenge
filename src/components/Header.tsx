import icon from '../../src/assets/icon-user.avif';
import search from '../../src/assets/icon-search.avif';
import productHunt from '../../src/assets/logo-product-hunt.avif';
import add from '../../src/assets/icon-add.avif';
import news from '../../src/assets/icon-news.avif';
import { getFormattedDate } from '../utils/formatDate';

const Header = () => {
  return (
    <>
      {/* Header Mobile Phone Devices */}
      <div className="flex items-center pt-6 md:pt-0">
        <div className='flex pl-6 pr-6 justify-between w-full items-center md:hidden'>
          <img
            src={icon}
            alt="User Icon"
            className="flex h-8 rounded-full"
          />
          <div className='flex h-8 rounded-lg bg-gray-200 items-center'>
            <p className='flex p-4 text-sm text-gray-600'>{getFormattedDate()}</p>
          </div>
          <div className='flex item-center'>
            <img
              src={search}
              alt="User Icon"
              className="flex h-10 rounded-full"
            />
          </div>
        </div>
      </div> 

      {/* Header Tablet + */}
      <div className="flex items-center pt-6 md:pt-0">
        <div className='hidden md:flex h-20 items-center justify-center w-full border-b border-gray-200'>
          <div className='flex h-20 w-full max-w-7xl justify-between items-center md:px-6'>
            {/* First Section of Laptop Header - Logo Section + Search */}
            <div className='flex items-center justify-between gap-4 lg:gap-6 xl:gap-0'>
              <img src={productHunt} alt="logo-product-hunt" className='h-10 cursor-pointer'/>
              <img src={search} alt="search" className='h-10 flex xl:hidden'/>
              <input type="text" className='hidden xl:flex rounded-full bg-gray-200 h-10 pl-4 pr-2 w-[70%] outline-[#FF6154] text-sm' placeholder='Search ( ctrl + k )'/>
            </div>
            {/* Second Section of the Laptop+ Header - Redirect Links Section */}
            <div className='flex items-center justify-between gap-12 lg:gap-14 '>
              <div className='flex items-center'>
                <p className='flex items-center text-sm font-semibold text-gray-600 cursor-pointer'>Launches ↓</p>
              </div>
              <div className='flex items-center'>
                <p className='flex items-center text-sm font-semibold text-gray-600 cursor-pointer'>Products ↓</p>
              </div>
              <div className='flex items-center'>
                <p className='flex items-center text-sm font-semibold text-gray-600 cursor-pointer'>News ↓</p>
              </div>
              <div className='flex items-center'>
                <p className='flex items-center text-sm font-semibold text-gray-600 cursor-pointer'>Forums ↓</p>
              </div>  
              <div className='hidden items-center xl:flex'>
                <p className='flex items-center text-sm font-semibold text-gray-600 cursor-pointer'>Advertise</p>
              </div> 
            </div>
            {/* Third Section of the Laptop Header - Add Buttons, News and Logged In Profile Section */}
            <div className='flex items-center justify-between gap-4 lg:gap-6'>
              <img src={add} alt="icon-add" className='h-10 border-2 border-gray-200 p-20% rounded-full xl:hidden'/>
              <div className='hidden xl:flex items-center justify-center rounded-full border-2 border-gray-200 p-1 cursor-pointer'>
                <img src={add} alt="icon-add" className='h-8'/>
                <p className='flex pr-2 text-sm font-semibold text-gray-600'>Submit</p>
              </div>
              <img src={news} alt="icon-news" className='h-10 border-2 border-gray-200 p-20% rounded-full cursor-pointer' />
              <img src={icon} alt="icon-user" className='h-10 rounded-full cursor-pointer'/>
            </div>
          </div>
        </div>   
     </div>
    </>
  );
};

export default Header;
