import React from "react";
import Button from "../common/Button";
import ArrowButton from "../common/ArrowButton";

const PlaceToWork = () => {
  return (
    <div className="w-full  overflow-hidden">
      {/* Wrapper */}
      <div className="w-full px-6 sm:px-10 md:pl-12 xl:pl-48 2xl:pl-[30rem] pr-6 py-20 sm:py-24 md:py-28 lg:py-32">
        {/* Top Content */}
        <div className="max-w-[700px]">
          <h2 className="heading-lg text-subheading mb-6">
            A Place to Work
          </h2>

          <p className=" para text-desc mb-6">
            Our headquarters sit quietly in Lower Parel, Mumbai—an urban oasis
            that holds onto the memory of Mumbai’s industrial past while
            embracing the city’s creative energy. Since our founding in 2021,
            we’ve collaborated with clients across India and internationally,
            building work that resonates beyond borders.
          </p>

          <p className=" para text-desc mb-8">
            At Point Of, we value curiosity, clarity, and collaboration. We’re a
            team shaped by culture, driven by design, and always eager to
            explore what’s next. Whether you’re a brand looking for a thoughtful
            partner or a creative looking for your next chapter—our doors are
            open.
          </p>

          {/* CTA */}
          <ArrowButton title={"LET’S TALK"} link={"mailto:think@wearepointof.com"} />
        </div>

        {/* Bottom Big Statement */}
        <div className="mt-20 sm:mt-24 md:mt-28 lg:mt-32">
          <h2
            className="heading-xl text-subheading mb-6"
          >
            Two minds. One vision
          </h2>

          <p className="heading-lg text-desc max-w-[900px]">
            Point Of was built by two people who see the same problem differently—which is exactly why it works.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlaceToWork;
