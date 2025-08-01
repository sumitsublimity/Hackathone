"use client";

import Image from "next/image";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { LoginForm } from "./login/_components/LoginForm";
import carouselCover from "@/../public/carousel/carousel-cover.svg";

const QueryClientWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const Page = () => {
  return (
    <QueryClientWrapper>
      <main className="min-h-screen">
        <article className="flex flex-col gap-10 md:flex-row max-h-screen ">
          <section className="w-full lg:w-1/2 md:max-h-screen bg-whiteBone">
            <Image
              src={carouselCover}
              alt=""
              priority
              className="h-[50vh] md:h-screen w-screen object-contain"
            />
          </section>
          <section className="place-content-center max-h-screen m-auto flex items-center w-full lg:w-1/2 px-4 lg:px-0">
            <div className="w-full max-w-sm lg:max-w-md xl:max-w-lg mx-auto">
              <LoginForm />
            </div>
          </section>
        </article>
      </main>
    </QueryClientWrapper>
  );
};

export default Page;
