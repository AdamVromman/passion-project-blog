import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function shuffleArray(array: any[]) {
  for (var i = array.length - 1; i >= 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

const DemoEye3 = () => {
  const main = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [womenKilled, setWomenKilled] = useState<number | null>(null);
  const [childrenKilled, setChildrenKilled] = useState<number | null>(null);
  const [menKilled, setMenKilled] = useState<number | null>(null);
  const [emergencyServiceMembersKilled, setEmergencyServiceMembersKilled] =
    useState<number | null>(null);
  const [medicalPersonnelKilled, setMedicalPersonnelKilled] = useState<
    number | null
  >(null);
  const [pressKilled, setPressKilled] = useState<number | null>(null);

  const [svgData, setSVGdata] = useState<any[]>([null]);

  const date = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [day, setDay] = useState(
    new Date(date.getFullYear(), date.getMonth() - 1, date.getDate(), 1, 0)
  );

  const getWidth = () => {
    if (svg && svg.current) {
      return svg.current.clientWidth;
    }
    const wrapper = document.querySelector("#demo-pattern");
    if (wrapper) {
      return wrapper.clientWidth;
    }
    if (window) {
      return window.innerWidth;
    }
    return 0;
  };

  const getData = async (day: Date) => {
    await fetch(
      "https://data.techforpalestine.org/api/v2/casualties_daily.json"
    ).then(async (response) => {
      if (response.ok) {
        let previousDay: any;
        await response.json().then((data: any[]) => {
          const date1 = data.find((d: any, i: number, data: any[]) => {
            const date = new Date(d.report_date);
            if (date.getTime() === day.getTime())
              previousDay = data[i - 1] ?? null;
            return date.getTime() === day.getTime();
          });

          console.log(date1, previousDay);

          if (
            date1 &&
            previousDay &&
            date1.report_source === previousDay.report_source
          ) {
            const childrenKilled =
              date1.ext_killed_children_cum -
              previousDay.ext_killed_children_cum;
            const womenKilled =
              date1.ext_killed_women_cum - previousDay.ext_killed_women_cum;
            const emergencyServiceMembersKilled =
              date1.ext_civdef_killed_cum - previousDay.ext_civdef_killed_cum;
            const medicalPersonnelKilled =
              date1.ext_med_killed_cum - previousDay.ext_med_killed_cum;

            const pressKilled =
              date1.ext_press_killed_cum - previousDay.ext_press_killed_cum;

            let menKilled =
              date1.ext_killed_cum -
              previousDay.ext_killed_cum -
              womenKilled -
              childrenKilled -
              emergencyServiceMembersKilled -
              medicalPersonnelKilled -
              pressKilled;

            if (menKilled < 0) {
              menKilled =
                date1.killed -
                womenKilled -
                childrenKilled -
                emergencyServiceMembersKilled -
                medicalPersonnelKilled -
                pressKilled;
            }

            if (menKilled < 0) {
              menKilled = 0;
            }

            setWomenKilled(womenKilled);
            setChildrenKilled(childrenKilled);
            setMenKilled(menKilled);
            setEmergencyServiceMembersKilled(emergencyServiceMembersKilled);
            setMedicalPersonnelKilled(medicalPersonnelKilled);
            setPressKilled(pressKilled);
          }
        });
      }
    });
  };

  useEffect(() => {
    console.log(womenKilled, childrenKilled, menKilled);
    generateEye();
  }, [womenKilled, childrenKilled, menKilled]);

  const generateEye = () => {
    const svgData = [];

    console.log(womenKilled);

    if (womenKilled) {
      for (let i = 0; i < womenKilled; i++) {
        const random = Math.random() * 20;
        svgData.push(
          <use
            id={`shape-${i}`}
            x={0}
            y={0}
            key={`woman-${i}`}
            className="eye-line-2 woman"
            href="#trapezium1"
            fill={`rgb(${random}, ${random}, ${random})`}
          />
        );
      }
    }

    if (childrenKilled) {
      for (let i = 0; i < childrenKilled; i++) {
        svgData.push(
          <use
            id={`shape-${(womenKilled ?? 0) + i}`}
            x={0}
            y={0}
            key={`child-${i}`}
            className="eye-line-2 child "
            href="#trapezium1"
            fill={`rgb(0, ${151 + (-10 + Math.random() * 20)}, 53)`}
          />
        );
      }
    }

    if (menKilled) {
      for (let i = 0; i < menKilled; i++) {
        svgData.push(
          <use
            id={`shape-${(womenKilled ?? 0) + (childrenKilled ?? 0) + i}`}
            x={0}
            y={0}
            className="eye-line-2 man"
            key={`man-${i}`}
            href="#trapezium1"
            fill={`rgb(${238 + (-10 + Math.random() * 20)}, 42, 52)`}
          />
        );
      }
    }

    console.log(svgData);
    shuffleArray(svgData);
    setSVGdata(svgData);
  };

  useGSAP(
    () => {
      gsap.set(".eye-line-2", {
        transformOrigin: "50% 130%",
        translateX: getWidth() / 2 - 156 / 2,
        y: "-50%",
        scale: 0.3,
      });

      svgData.forEach((_, i) => {
        gsap.fromTo(
          `#shape-${i}`,
          {
            rotate: 0,
            scale: 0,
          },
          {
            duration: 3 * Math.random() + 2,
            rotate: 360 * Math.random(),
            scale: 0.3 + Math.random() * 0.05,
            ease: "power3.out",
          }
        );
      });
    },
    { dependencies: [svgData] }
  );

  useEffect(() => {
    console.log(day);
    getData(day);
  }, []);

  return (
    <div
      id="demo-pattern"
      ref={main}
      className="relative w-full h-96 border border-black rounded-lg overflow-y-hidden overflow-x-auto"
    >
      <svg ref={svg} className="w-full h-96 absolute top-0 left-0">
        <defs>
          <polygon id="trapezium1" points="0 0 30 288 60 288 90 0 0 0" />
        </defs>
        {svgData}
      </svg>
      <div className="relative z-20 flex flex-row gap-4 p-4 items-center">
        <button
          onClick={() => {
            setDay(new Date(day.getTime() - 24 * 60 * 60 * 1000));
            getData(new Date(day.getTime() - 24 * 60 * 60 * 1000));
          }}
          className="button"
        >
          day --
        </button>
        <button
          onClick={() => {
            setDay(new Date(day.getTime() + 24 * 60 * 60 * 1000));
            getData(new Date(day.getTime() + 24 * 60 * 60 * 1000));
          }}
          className="button"
        >
          day ++
        </button>
        <span>{day.toLocaleDateString("nl-BE")}</span>
      </div>
    </div>
  );
};

export default DemoEye3;
