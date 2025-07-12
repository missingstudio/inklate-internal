import { HandleType } from "~/enums/handle-type.enum";
import { color } from "~/utils/colors";

export const getHandleColor = (type: HandleType) => {
  switch (type) {
    case HandleType.Image:
      return color.DataType_Image;
    case HandleType.Video:
      return color.DataType_Video;
    case HandleType.Audio:
      return color.DataType_Audio;
    case HandleType.ThreeD:
      return color.DataType_3D;
    case HandleType.Text:
      return color.DataType_Text;
    case HandleType.Number:
      return color.DataType_Number;
    case HandleType.Boolean:
      return color.DataType_Boolean;
    case HandleType.Array:
      return color.DataType_Array;
    default:
      return color.DataType_Any;
  }
};
