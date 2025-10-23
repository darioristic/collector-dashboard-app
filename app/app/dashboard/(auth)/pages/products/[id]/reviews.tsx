import { StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateAvatarFallback } from "@/lib/utils";

const reviews = [
  {
    id: 4,
    name: "Mark P.",
    image: `https://bundui-images.netlify.app/avatars/01.png`,
    title: "Excellent performance for the price",
    body: "This Basic VPS plan exceeded my expectations. The Ubuntu 22.04 LTS runs smoothly, and the 1GB RAM is sufficient for my small website. Great uptime and support!",
    date: "5 days ago"
  },
  {
    id: 5,
    name: "Jessica K.",
    image: `https://bundui-images.netlify.app/avatars/02.png`,
    title: "Perfect for development",
    body: "I use this VPS for development and testing. The performance is consistent, setup was easy, and the price is unbeatable for what you get. Highly recommended!",
    date: "2 weeks ago"
  },
  {
    id: 6,
    name: "Michael B.",
    image: `https://bundui-images.netlify.app/avatars/03.png`,
    title: "Reliable hosting solution",
    body: "Been using this VPS for 3 months now. The 99.9% uptime SLA is real - I've had zero downtime. The SSD storage is fast, and support responds quickly.",
    date: "4 days ago"
  },
  {
    id: 7,
    name: "Anna M.",
    image: `https://bundui-images.netlify.app/avatars/04.png`,
    title: "Good starter VPS",
    body: "This is my first VPS and it's been great for learning. The Ubuntu setup is straightforward, and the 20GB storage is adequate for small projects.",
    date: "6 days ago"
  },
  {
    id: 8,
    name: "Chris T.",
    image: `https://bundui-images.netlify.app/avatars/05.png`,
    title: "Great value for money",
    body: "At $9.99/month, this VPS offers excellent value. The performance is consistent, backups work reliably, and the DDoS protection gives peace of mind.",
    date: "1 day ago"
  },
  {
    id: 9,
    name: "Lisa G.",
    image: `https://bundui-images.netlify.app/avatars/06.png`,
    title: "Solid performance",
    body: "The VPS handles my WordPress site perfectly. The 1 vCPU provides enough power, and the NVMe SSD makes everything feel snappy. Good choice for small businesses.",
    date: "3 weeks ago"
  },
  {
    id: 10,
    name: "David L.",
    image: `https://bundui-images.netlify.app/avatars/10.png`,
    title: "Professional hosting service",
    body: "This VPS plan is perfect for my portfolio website. The Ubuntu 22.04 LTS is stable, performance is reliable, and the automated backups are a lifesaver.",
    date: "1 month ago"
  }
];

export default function ProductReviewList() {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="grid gap-4 rounded-lg border p-4">
          <div className="flex items-start gap-4">
            <Avatar className="size-10">
              <AvatarImage src={review.image} />
              <AvatarFallback>{generateAvatarFallback(review.name)}</AvatarFallback>
            </Avatar>
            <div className="grid grow gap-1">
              <div className="flex items-center justify-between gap-2">
                <div className="font-medium">{review.name}</div>
                <div className="text-muted-foreground text-xs">{review.date}</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  <div className="flex items-center gap-1">
                    <StarIcon className="size-4 fill-orange-400 stroke-orange-400" />
                    <div className="text-muted-foreground text-sm">4.8</div>
                  </div>
                </Badge>
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <div className="font-semibold">{review.title}</div>
            <div className="text-muted-foreground text-sm">{review.body}</div>
          </div>
        </div>
      ))}
      <div className="text-center">
        <Button variant="outline">Load more reviews</Button>
      </div>
    </div>
  );
}
