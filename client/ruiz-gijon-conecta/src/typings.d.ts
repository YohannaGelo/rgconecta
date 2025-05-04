declare module 'cropperjs' {
    interface Options {
      aspectRatio?: number;
      viewMode?: 0 | 1 | 2 | 3;
      autoCropArea?: number;
      background?: boolean;
      responsive?: boolean;
      checkCrossOrigin?: boolean;
      checkOrientation?: boolean;
      ready?: () => void;
      // Añade otras opciones que necesites
    }
  
    export default class Cropper {
      constructor(element: HTMLImageElement, options?: Options);
      destroy(): void;
      getCroppedCanvas(options?: object): HTMLCanvasElement;
      // Añade otros métodos que uses
    }
  }