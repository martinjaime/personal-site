import React from "react";
import { Helmet } from "react-helmet";

interface WishListItem {
  description: string;
  url?: string;
  details?: string;
}

const wishListItems: WishListItem[] = [
  {
    description: "Voyager Keyboard",
    details: "Black colored keycaps, blank (no print) keycaps, Kaihl Choc Brown keyswitches",
    url: "https://www.zsa.io/voyager/buy",
  },
  {
    description: "A nice card :)"
  },
  {
    description: "Take me out to eat 1 on 1"
  },
  {
    description: "A cooking class voucher",
    details: "don't ask me how to get this, I have no idea"
  },
  {
    description: "Voucher for a massage or float",
  },
  {
    description: "Amazon Wishlist",
    url: "https://www.amazon.com/hz/wishlist/ls/RO0JJLMLD38Y",
  },
  {
    description: "Not things that will sit and collect dust (stuffed animals, desk decoration, etc.)",
  },
]

const WishList: React.FC = () => {
  return (
    <>
    <Helmet>
      <title>Martin's Wish List</title>
    </Helmet>
    <div className="flex flex-col items-center h-full text-white p-4">
      <h1 className="pt-10 pb-5">
        Hello! Here is my wishlist. Your interest is much appreciated :)
      </h1>
      <p>Last updated on May 21, 2025</p>
      <ul className="space-y-4 px-4">
        {wishListItems.map(item => (
          <li key={item.description}>
            <a className={`font-bold ${item.url ? "text-blue-400 hover:underline" : ""}`} href={item.url}>
              {item.description}
            </a>
            {item.details && <p className="font-light">{item.details}</p>}
          </li>
        ))}
      </ul>
    </div>
    </>
  )
}

export default WishList;
