import Diversity2OutlinedIcon from '@mui/icons-material/Diversity2Outlined';
import SettingsVoiceOutlinedIcon from '@mui/icons-material/SettingsVoiceOutlined';
import { IconCategoryPlus } from '@tabler/icons-react';
import Slider from 'react-slick';
import CarouselItem from './carousel-iitem';

const settings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 3,
  responsive: [
    {
      breakpoint: 1300,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 680,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
};
export const Carousel = () => {
  return (
    <Slider {...settings}>
      <CarouselItem
        title="Transcriber AI"
        price="915"
        icon={<SettingsVoiceOutlinedIcon />}
        description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s.Try and Tell us the difference."
      />

      <CarouselItem
        title="Care Plan Suggester"
        price="915"
        icon={<Diversity2OutlinedIcon />}
        description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s.Try and Tell us the difference."
      />

      <CarouselItem
        title="Finance Dashboard"
        price="915"
        icon={<IconCategoryPlus />}
        description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s.Try and Tell us the difference."
      />

      <CarouselItem
        title="Finance Dashboard"
        price="915"
        icon={<IconCategoryPlus />}
        description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s.Try and Tell us the difference."
      />
    </Slider>
  );
};
export default Carousel;
