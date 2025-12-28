import CreativeIcon1 from '../../../assets/icons/veg.png';
import CreativeIcon2 from '../../../assets/icons/nonveg.png';
import CreativeIcon3 from '../../../assets/icons/egg.png';
import CreativeIcon4 from '../../../assets/icons/dslr.png';
import CreativeIcon5 from '../../../assets/icons/painting.png';
import CreativeIcon6 from '../../../assets/icons/guitar.png';


import FunIcon1 from '../../../assets/icons/smoke.png';
import FunIcon2 from '../../../assets/icons/no-smoking.png';
import FunIcon3 from '../../../assets/icons/ocas.png';
import FunIcon4 from '../../../assets/icons/reading.png';
import FunIcon5 from '../../../assets/icons/sports.png';
import FunIcon6 from '../../../assets/icons/social.png';
import FunIcon7 from '../../../assets/icons/gaming.png';


import FitnessIcon1 from '../../../assets/icons/al.png';
import FitnessIcon2 from '../../../assets/icons/noal.png';
import FitnessIcon3 from '../../../assets/icons/ocas.png';
import FitnessIcon4 from '../../../assets/icons/walking.png';
import FitnessIcon5 from '../../../assets/icons/walking.png';
import FitnessIcon6 from '../../../assets/icons/tracking.png';

import otherIcon1 from '../../../assets/icons/dog.png';
import otherIcon2 from '../../../assets/icons/cooking.png';
import otherIcon3 from '../../../assets/icons/vegan.png';
import otherIcon4 from '../../../assets/icons/dslr.png';
import otherIcon5 from '../../../assets/icons/singing.png';
import otherIcon6 from '../../../assets/icons/guitar.png';
import otherIcon7 from '../../../assets/icons/painting.png';

const icons = {
  Diet: [
    { name: "Vegetarian", icon: CreativeIcon1, borderWidth: 1 },
    { name: "Non Vegetarian", icon: CreativeIcon2, borderWidth:1 },
    { name: "Eggetarian", icon: CreativeIcon3, borderWidth: 1 },
    // { name: "Photography", icon: CreativeIcon4, borderWidth: 1 },
    // { name: "Painting", icon: CreativeIcon5, borderWidth: 1 },
    // { name: "Playing Instruments", icon: CreativeIcon6, borderWidth: 1 },

  ],
  Smoking: [
    { name: "Yes", icon: FunIcon1, borderWidth: 1 },
    { name: "No", icon: FunIcon2, borderWidth: 1 },
    { name: "Occasionally", icon: FunIcon3, borderWidth: 1 },
    // { name: "Music", icon: FunIcon4, borderWidth: 1 },
    // { name: "Sports", icon: FunIcon5, borderWidth: 1 },
    // { name: "Social Media", icon: FunIcon6, borderWidth: 1 },
    // { name: "Gaming", icon: FunIcon7, borderWidth: 1 },

  ],
  Drinking: [
    { name: "Yes", icon: FitnessIcon1, borderWidth: 1 },
    { name: "No", icon: FitnessIcon2, borderWidth: 1 },
    { name: "Occasionally", icon: FitnessIcon3, borderWidth: 1 },
    // { name: "Walking", icon: FitnessIcon4, borderWidth: 1 }, 
    // { name: "Trekking", icon: FitnessIcon6, borderWidth: 1 },


  ],
  otherInterests: [
    { name: "Dogs", icon: otherIcon1, borderWidth: 1 },
    { name: "Cooking", icon: otherIcon2, borderWidth: 1 },
    { name: "Vegan", icon: otherIcon3, borderWidth: 1 },
    { name: "News & Politics", icon: otherIcon4, borderWidth: 1 },
    { name: "Social Service", icon: otherIcon5, borderWidth: 1 },
    { name: "Entrepreneurship", icon: otherIcon6, borderWidth: 1 },
    { name: "Home Decor", icon: otherIcon7, borderWidth: 1 },

  ],
};

const getSizeByDimensions = (height: number, width: number) => {
  const size = Math.min(height, width) * 0.15; 
  return Math.round(size);
};

export { icons, getSizeByDimensions };
