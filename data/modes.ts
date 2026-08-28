export type Mode = {
  id: string;
  name: string;
  hindiName: string;
  description: string;
  image: string;
};

export const modes: Mode[] = [
  {
    id: "bus-wala",
    name: "हरियाणा रोडवेज़",
    hindiName: "हरियाणा रोडवेज़",
    description: "लंबी सड़कें, खिड़की वाली सीट और रास्ते के गीत।",
    image: "/images/modes/bus-wala.webp",
  },
  {
    id: "chai-tapri",
    name: "चाय की टपरी",
    hindiName: "चाय की टपरी",
    description: "चाय, बातचीत और सड़क किनारे के गीत।",
    image: "/images/modes/chai-tapri.webp",
  },
  {
    id: "raat-ki-shift",
    name: "नाइट शिफ्ट",
    hindiName: "नाइट शिफ्ट",
    description: "देर रात, खाली सड़कें और हेडफ़ोन।",
    image: "/images/modes/raat-ki-shift.webp",
  },
  {
    id: "rajesh-carpenter",
    name: "राजेश कारपेंटर",
    hindiName: "राजेश कारपेंटर",
    description: "लकड़ी, औज़ार और पुराने रेडियो के नग़मे।",
    image: "/images/modes/rajesh-carpenter.webp",
  },
  {
    id: "raju-mistri",
    name: "राजू मिस्त्री",
    hindiName: "राजू मिस्त्री",
    description: "काम की सुबह और देसी जोश।",
    image: "/images/modes/raju-mistri.webp",
  },
  {
    id: "safai-wala",
    name: "सुबह की ड्यूटी",
    hindiName: "सुबह की ड्यूटी",
    description: "सुबह की शुरुआत और जागता हुआ शहर।",
    image: "/images/modes/safai-wala.webp",
  },
  {
    id: "saloon",
    name: "छोटू नाई",
    hindiName: "छोटू नाई",
    description: "पुराने आईने, कैसेट की धुनें और बॉलीवुड।",
    image: "/images/modes/saloon.webp",
  },
  {
    id: "truck-wala",
    name: "ट्रक वाला",
    hindiName: "ट्रक वाला",
    description: "हाइवे, ढाबे और देसी सफ़र की धुन।",
    image: "/images/modes/truck-wala.webp",
  },
  {
    id: "kk",
    name: "केके",
    hindiName: "केके",
    description: "यादों में लौटती हुई केके की सदाबहार आवाज़।",
    image: "/images/modes/kk.webp",
  },
  {
    id: "monsoon",
    name: "बारिश",
    hindiName: "बारिश",
    description: "बाहर बारिश, अंदर संगीत।",
    image: "/images/modes/monsoon.webp",
  },
  {
    id: "midnight",
    name: "आधी रात",
    hindiName: "आधी रात",
    description: "शांत गलियाँ, धीमी रोशनी और रात की धुनें।",
    image: "/images/modes/midnight.webp",
  },
  {
    id: "lofi-study",
    name: "स्टडी",
    hindiName: "स्टडी",
    description: "फोकस, पढ़ाई और गहरे काम के लिए धीमी धुनें।",
    image: "/images/modes/lofi-study.webp",
  },
];

export function getMode(modeId: string) {
  return modes.find((mode) => mode.id === modeId);
}
