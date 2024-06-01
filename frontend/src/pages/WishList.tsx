import React from "react";
import { Helmet } from "react-helmet";

interface WishListItem {
  description: string;
  url?: string;
  details?: string;
}

const wishListItems: WishListItem[] = [
  {
    description: "Vivo Primus Lite III",
    details: "Size EU 40, Color Obsidian",
    url: "https://www.vivobarefoot.com/us/primus-lite-iii-mens-ss22?colour=Obsidian",
  },
  {
    description: "Uplift Desk PC holder",
    details: "Need a Track Spacer accessory as well",
    url: "https://www.upliftdesk.com/cpu-holder-by-uplift-desk/",
  },
  {
    description: 'A large "Mme Kupka among Verticals" print'
  },
  {
    description: "A nice card :)"
  },
  {
    description: "v bucks 😬"
  },
  {
    description: "Take me out to eat 1 on 1"
  },
  {
    description: "A cooking class voucher",
    details: "don't ask me how to get this, I have no idea"
  },
  {
    description: "A rug tufting session for you and me",
    details: "But only if they let me make a kirby rug",
    url: "https://www.vibesdiystudio.com/book",
  },
  {
    description: "Voucher for a massage or float",
  },
  {
    description: "Amazon Wishlist",
    url: "https://www.amazon.com/hz/wishlist/ls/RO0JJLMLD38Y?ref_=wl_share",
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
      <h1 className="py-10">
        Hello! Here is my wishlist. Your interest is much appreciated :)
      </h1>
      <ul className="space-y-4 px-4">
        {wishListItems.map(item => (
          <li key={item.description}>
            <a className={`font-bold ${item.url && "hover:text-blue-700"}`} href={item.url}>
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
