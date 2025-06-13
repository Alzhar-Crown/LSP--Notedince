import { ImgHTMLAttributes, SVGAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img {...props} src="/image/images.png" alt="logo" >
           
        </img>
    );
}
