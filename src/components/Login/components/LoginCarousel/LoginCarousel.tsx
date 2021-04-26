import React from "react";
import { Carousel } from "antd";
import LoginCarouselItem from "../LoginCarouselItem";
import "./LoginCarousel.less";

// Shows a carousel with three custom items.
function LoginCarousel() {
  return (
    <Carousel
      autoplay
      style={{
        backgroundImage: "linear-gradient(135deg, #8BC6EC 0%, #192A51 100%)",
        backgroundColor: "#8BC6EC",
        backgroundSize: "300% 300%",
        animation: "gradient 4s ease infinite",
      }}
    >
      <LoginCarouselItem
        iconURL={
          "https://www.flaticon.com/svg/vstatic/svg/2666/2666523.svg?token=exp=1618503183~hmac=c509e5c7336d25c593191ebb2cebe4d4"
        }
        title="Trustable Code"
        description={
          "Make your customized digital handshakes relying on an EOSIO blockchain-based solution"
        }
      />
      <LoginCarouselItem
        iconURL={
          "https://www.flaticon.com/svg/vstatic/svg/913/913240.svg?token=exp=1618503133~hmac=b1875f0caf84c9e14693e7722a92fd7d"
        }
        title="Resolve Disputes"
        description="Reduce cost-benefit ratio for opening a dispute through our fair and decentralized mechanism."
      />
      <LoginCarouselItem
        iconURL={
          "https://cdn3.iconfinder.com/data/icons/popular-cryptocurrencies-vol-2019-1/80/eos-cryptocurrency-token-coin-ecosystem-adoption-512.png"
        }
        title="Secure Payments"
        description="Automatic token payments through an intelligent escrow service designed to lock token amounts and redistribute them based on the handshake status"
      />
    </Carousel>
  );
}

export default LoginCarousel;
