"use client";
import React, { useState } from 'react'
import { Plus } from "lucide-react";
import Button from '../common/Button'

const AccordionSection = ({ data, title, description, padding = "editorial", flushBottom = false }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggle = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    // Match Footer horizontal rhythm on home; keep editorial gutter on Connect/Expertise.
    const padClass =
      padding === "footer"
        ? "px-6 sm:px-10 md:px-12 lg:px-14 xl:px-20"
        : "px-6 sm:px-10 md:pl-12 xl:pl-80 2xl:pl-120 pr-6";

    return (
        <section className={`w-full pt-16 sm:pt-20 md:pt-28 lg:pt-32 ${flushBottom ? "" : "pb-16 sm:pb-20 md:pb-28 lg:pb-32"}`}>
            <div className={`w-full ${padClass}`}>
                {/* Vacancies */}
                <h3 className="heading-xl text-subheading ">
                    {title}
                </h3>
                {description && (
                    <p className="para text-desc  mt-4 max-w-none xl:max-w-3xl">
                        {description}
                    </p>
                )}

                {/* Accordion */}
                <div className="border-t border-white/20 max-w-none xl:max-w-3xl mt-12">
                    {data.map((job, index) => {
                        const isOpen = activeIndex === index;

                        return (
                        <div key={index} className="border-b border-white/20">

                            {/* Header */}
                            <button
                                type="button"
                                onClick={() => toggle(index)}
                                className="w-full flex items-center justify-between py-6 lg:py-8 cursor-pointer group text-left"
                            >
                                <span className={`heading-lg text-desc transition group-hover:text-heading ${isOpen ? "text-heading" : "text-desc"}`}>
                                    {job.title}
                                </span>

                                <Plus
                                    className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
                                        isOpen ? "rotate-45" : ""
                                    }`}
                                />
                            </button>

                            {/* Content */}
                            <div
                                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                                }`}
                            >
                                <div className="overflow-hidden min-h-0">
                                {job.content ? (
                                    <div className="space-y-6 para-acc text-desc pointer-events-auto max-w-none xl:max-w-2xl pb-6">

                                        {/* Meta */}
                                        <div className="uppercase space-y-1">
                                            <p className="font-medium text-heading">Experience: {job.content.exp}</p>
                                            <p className="font-medium text-heading">Location: {job.content.location}</p>
                                            <p className="font-medium text-heading">Immediate: {job.content.type}</p>
                                        </div>

                                        <p>{job.content.description}</p>

                                        <div>
                                            <h4 className="font-medium text-heading uppercase mb-2">
                                                About You:
                                            </h4>
                                            <p>{job.content.about}</p>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-heading uppercase mb-2">
                                                What You'll Do:
                                            </h4>
                                            <ul className="list-disc pl-5 space-y-2">
                                                {job.content.work.map((item, i) => (
                                                    <li key={i}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-heading uppercase mb-2">
                                                Requirements:
                                            </h4>
                                            <ul className="list-disc pl-5 space-y-2">
                                                {job.content.requirements.map((item, i) => (
                                                    <li key={i}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-heading uppercase mb-2">
                                                Software Skills:
                                            </h4>
                                            <p>{job.content.skills}</p>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-heading uppercase mb-2">
                                                Culture Note:
                                            </h4>
                                            <p>{job.content.culture}</p>
                                        </div>


                                        <Button title="APPLY" onClick={() => {
                                            window.open(`mailto:think@wearepointof.com?subject=Application for ${job.title}`);
                                        }} />

                                    </div>
                                ) : (
                                    <div className="para-acc text-desc max-w-none xl:max-w-2xl pb-6">
                                        <p>{job.body ?? job.description}</p>
                                    </div>
                                )}
                                </div>
                            </div>

                        </div>
                        );
                    })}
                </div>
            </div>
        </section >
    )
}

export default AccordionSection