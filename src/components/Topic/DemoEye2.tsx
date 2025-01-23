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

const DemoEye2 = () => {
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

  const date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [weekStart, setWeekStart] = useState(
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

  const getWeeklyData = async (weekStartDay: Date) => {
    await fetch(
      "https://data.techforpalestine.org/api/v2/casualties_daily.json"
    ).then(async (response) => {
      if (response.ok) {
        await response.json().then((data: any[]) => {
          const date1 = data.find((d: any) => {
            const date = new Date(d.report_date);
            if (date.getTime() === weekStartDay.getTime())
              return date.getTime() === weekStartDay.getTime();
          });

          const killed = data
            .filter((d: any) => {
              const date = new Date(d.report_date);
              return (
                date.getTime() > weekStartDay.getTime() &&
                date.getTime() <=
                  weekStartDay.getTime() + 7 * 24 * 60 * 60 * 1000
              );
            })
            .reduce((acc, d) => {
              return acc + d.killed;
            }, 0);

          const date2 = data.find((d: any) => {
            const date = new Date(d.report_date);
            if (
              date.getTime() ===
              weekStartDay.getTime() + 6 * 24 * 60 * 60 * 1000
            )
              return (
                date.getTime() ===
                weekStartDay.getTime() + 6 * 24 * 60 * 60 * 1000
              );
          });
          console.log(date1, date2);

          if (date1 && date2 && date1.report_source === date2.report_source) {
            const childrenKilled =
              (date2.killed_children_cum ?? date2.ext_killed_children_cum) -
              (date1.killed_children_cum ?? date1.ext_killed_children_cum);
            const womenKilled =
              (date2.killed_women_cum ?? date2.ext_killed_women_cum) -
              (date1.killed_women_cum ?? date1.ext_killed_women_cum);
            const emergencyServiceMembersKilled =
              (date2.civdef_killed_cum ?? date2.ext_civdef_killed_cum) -
              (date1.civdef_killed_cum ?? date1.ext_civdef_killed_cum);
            const medicalPersonnelKilled =
              (date2.med_killed_cum ?? date2.ext_med_killed_cum) -
              (date1.med_killed_cum ?? date1.ext_med_killed_cum);

            const pressKilled =
              (date2.press_killed_cum ?? date2.ext_press_killed_cum) -
              (date1.press_killed_cum ?? date1.ext_press_killed_cum);

            let menKilled =
              (date2.killed_cum ?? date2.ext_killed_cum) -
              (date1.killed_cum ?? date1.ext_killed_cum) -
              womenKilled -
              childrenKilled -
              emergencyServiceMembersKilled -
              medicalPersonnelKilled -
              pressKilled;

            if (menKilled < 0) {
              menKilled =
                killed -
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
            className="eye-line woman"
            href="#trapezium"
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
            className="eye-line child "
            href="#trapezium"
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
            className="eye-line man"
            key={`man-${i}`}
            href="#trapezium"
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
      gsap.set(".eye-line", {
        transformOrigin: "50% 130%",
        translateX: getWidth() / 2 - 156 / 2,
        y: "-50%",
        scale: 0.3,
      });

      gsap.set(".eye-line.child", {
        scale: 0.27,
      });

      gsap.fromTo(
        ".eye-line",
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 0.3, duration: 0.4, ease: "bounce" }
      );

      svgData.forEach((_, i) => {
        gsap.fromTo(
          `#shape-${i}`,
          {
            rotate: 0,
          },
          {
            duration: 5,
            rotate: 360 * Math.random(),
          }
        );
      });
    },
    { dependencies: [svgData] }
  );

  useEffect(() => {
    console.log(weekStart);
    getWeeklyData(weekStart);
  }, []);

  return (
    <div
      id="demo-pattern"
      ref={main}
      className="relative w-full h-96 border border-black rounded-lg overflow-y-hidden overflow-x-auto"
    >
      <svg ref={svg} className="w-full h-96 absolute top-0 left-0">
        <defs>
          <polygon id="trapezium" points="0 0 35.88 288 120.12 288 156 0 0 0" />
        </defs>
        {svgData}
      </svg>
      <div className="relative z-20 flex flex-row gap-4 p-4 items-center">
        <button
          onClick={() => {
            setWeekStart(
              new Date(weekStart.getTime() - 7 * 24 * 60 * 60 * 1000)
            );
            getWeeklyData(
              new Date(weekStart.getTime() - 7 * 24 * 60 * 60 * 1000)
            );
          }}
          className="button"
        >
          week --
        </button>
        <button
          onClick={() => {
            setWeekStart(
              new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000)
            );
            getWeeklyData(
              new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000)
            );
          }}
          className="button"
        >
          week ++
        </button>
        <span>
          {weekStart.toLocaleDateString("nl-BE")} -{" "}
          {new Date(
            weekStart.getTime() + 6 * 24 * 60 * 60 * 1000
          ).toLocaleDateString("nl-BE")}
        </span>
      </div>
    </div>
  );
};

export default DemoEye2;
