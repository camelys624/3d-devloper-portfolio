import { Pane } from "tweakpane";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useEffect, useRef, useState } from "react";
import './index.css'
gsap.registerPlugin(Draggable);

const base = {
  scale: -180,
  radius: 16,
  border: 0.07,
  lightness: 50,
  blend: "difference",
  x: "R",
  y: "B",
  alpha: 0.93,
  blur: 11,
};

const presets = {
  dock: {
    ...base,
    width: 336,
    height: 96,
    blur: 6,
    displace: 10,
    frost: 0.05,
  },
  pill: {
    ...base,
    width: 200,
    height: 80,
    displace: 1,
    radius: 40,
  },
  bubble: {
    ...base,
    radius: 70,
    width: 140,
    height: 140,
    displace: 1,
    frost: 0,
  },
  free: {
    ...base,
    width: 140,
    height: 280,
    radius: 70,
    border: 0.15,
    alpha: 0.74,
    lightness: 60,
    blur: 10,
    displace: 0,
    scale: -300,
  },
};

const index = () => {
  const debugRef = useRef(null);
  const effectRef = useRef(null);
  const [config, setConfig] = useState({
    ...presets.dock,
    theme: "system",
    debug: false,
    preset: "dock",
  });
  const buildDisplacementImage = () => {
    const border =
      Math.min(config.width, config.height) * (config.border * 0.5);
    const kids = `<svg class="displacement-image" viewBox="0 0 ${
      config.width
    } ${config.height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="red" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#0000"/>
          <stop offset="100%" stop-color="red"/>
        </linearGradient>
        <linearGradient id="blue" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0000"/>
          <stop offset="100%" stop-color="blue"/>
        </linearGradient>
      </defs>
      <!-- backdrop -->
      <rect x="0" y="0" width="${config.width}" height="${
      config.height
    }" fill="black"></rect>
      <!-- red linear -->
      <rect x="0" y="0" width="${config.width}" height="${config.height}" rx="${
      config.radius
    }" fill="url(#red)" />
      <!-- blue linear -->
      <rect x="0" y="0" width="${config.width}" height="${config.height}" rx="${
      config.radius
    }" fill="url(#blue)" style="mix-blend-mode: ${config.blend}" />
      <!-- block out distortion -->
      <rect x="${border}" y="${
      Math.min(config.width, config.height) * (config.border * 0.5)
    }" width="${config.width - border * 2}" height="${
      config.height - border * 2
    }" rx="${config.radius}" fill="hsl(0 0% ${config.lightness}% / ${
      config.alpha
    }" style="filter:blur(${config.blur}px)" />
    </svg>
    <div class="label">
      <span>displacement image</span>
      <svg viewBox="0 0 97 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M74.568 0.553803C74.0753 0.881909 73.6295 1.4678 73.3713 2.12401C73.1367 2.70991 72.3858 4.67856 71.6584 6.50658C70.9544 8.35803 69.4526 11.8031 68.3498 14.1936C66.1441 19.0214 65.839 20.2167 66.543 21.576C67.4581 23.3337 69.4527 23.9196 71.3064 22.9821C72.4797 22.3728 74.8965 19.5839 76.9615 16.4435C78.8387 13.5843 78.8387 13.6077 78.1113 18.3418C77.3369 23.4275 76.4687 26.2866 74.5915 30.0364C73.254 32.7316 71.8461 34.6299 69.218 37.3485C65.9563 40.6999 62.2254 42.9732 57.4385 44.4965C53.8718 45.6449 52.3935 45.8324 47.2546 45.8324C43.3594 45.8324 42.1158 45.7386 39.9805 45.2933C32.2604 43.7466 25.3382 40.9577 19.4015 36.9735C15.0839 34.0909 12.5028 31.7004 9.80427 27.9975C6.80073 23.9196 4.36038 17.2403 3.72682 11.475C3.37485 8.1471 3.1402 7.32683 2.43624 7.13934C0.770217 6.71749 0.183578 7.77211 0.0193217 11.5219C-0.26226 18.5996 2.55356 27.1304 7.17619 33.1066C13.8403 41.7545 25.432 48.4103 38.901 51.2696C41.6465 51.8555 42.2566 51.9023 47.4893 51.9023C52.3935 51.9023 53.426 51.832 55.5144 51.3867C62.2723 49.9337 68.5375 46.6292 72.949 42.1998C76.0464 39.1296 78.1113 36.2939 79.8946 32.7081C82.1942 28.0912 83.5317 23.3103 84.2591 17.17C84.3999 15.8576 84.6111 14.7795 84.7284 14.7795C84.8223 14.7795 85.4559 15.1311 86.1364 15.5763C88.037 16.7716 90.3835 17.8965 93.5748 19.0918C96.813 20.3339 97.3996 20.287 96.4141 18.9512C94.9123 16.9122 90.055 11.5219 87.1219 8.63926C84.0949 5.66288 83.8368 5.33477 83.5552 4.1864C83.3909 3.48332 83.0155 2.68649 82.6401 2.31151C82.0065 1.6553 80.4109 1.04595 79.9885 1.30375C79.8712 1.37406 79.2845 1.11626 78.6744 0.717845C77.2431 -0.172727 75.7413 -0.243024 74.568 0.553803Z" fill="currentColor"></path>
      </svg>
    </div>
  `;
    if (!debugRef.current) return;
    debugRef.current.innerHTML = kids;

    const svgEl = debugRef.current.querySelector(".displacement-image");
    const serialized = new XMLSerializer().serializeToString(svgEl);
    const encoded = encodeURIComponent(serialized);
    const dataUrl = `data:image/svg+xml,${encoded}`;

    gsap.set("feImage", {
      attr: {
        href: dataUrl,
      },
    });
    gsap.set("feDisplacementMap", {
      attr: {
        xChannelSelector: config.x,
        yChannelSelector: config.y,
      },
    });
  };

  const update = () => {
    buildDisplacementImage();
    gsap.set(document.documentElement, {
      "--width": config.width,
      "--height": config.height,
      "--radius": config.radius,
      "--frost": config.frost,
      "--output-blur": config.displace,
    });
    gsap.set("feDisplacementMap", {
      attr: {
        scale: config.scale,
      },
    });

    document.documentElement.dataset.mode = config.preset;
    document.documentElement.dataset.debug = config.debug;
    document.documentElement.dataset.theme = config.theme;
  };

  useEffect(() => {
    if (!debugRef.current) return;

    update();
    if (effectRef.current) {
      Draggable.create(effectRef.current, {
        type: "x,y",
      });

      document.documentElement.style.setProperty("--size", config.size);
      gsap.set(effectRef.current, {
        bottom: 100,
        left: '50%',
        opacity: 1,
      });
    }

    const ctrl = new Pane({
      title: "config",
      expanded: true,
    });

    ctrl.addBinding(config, "debug").on("change", (ev) => {
      setConfig((prev) => ({
        ...prev,
        debug: ev.value,
      }));
    });
    ctrl
      .addBinding(config, "preset", {
        label: "mode",
        options: {
          dock: "dock",
          pill: "pill",
          bubble: "bubble",
          free: "free",
        },
      })
      .on("change", (ev) => {
        document.documentElement.dataset.mode = config.preset;

        settings.disabled = config.preset !== "free";
        settings.expanded = config.preset === "free";
        if (config.preset !== "free") {
          const values = presets[config.preset];
          const morph = gsap.timeline({
            onUpdate: () => {
              ctrl.refresh();
            },
          });

          for (const [key, value] of Object.entries(values)) {
            morph.to(
              config,
              {
                [key]: value,
              },
              0
            );
          }
        }

        setConfig((prev) => ({
          ...prev,
          preset: ev.value,
        }));
      });

    ctrl
      .addBinding(config, "theme", {
        label: "theme",
        options: {
          system: "system",
          light: "light",
          dark: "dark",
        },
      })
      .on("change", (ev) => {
        setConfig((prev) => ({
          ...prev,
          theme: ev.value,
        }));
      });

    const settings = ctrl
      .addFolder({
        title: "settings",
        expanded: false,
        disabled: true,
      })
      .on("change", (ev) => {
        setConfig((prev) => ({
          ...prev,
          [ev.preset]: ev.value,
        }));
      });

    settings
      .addBinding(config, "frost", {
        label: "frost",
        min: 0,
        max: 1,
        step: 0.01,
      })
      .on("change", (ev) => {
        setConfig((prev) => ({
          ...prev,
          frost: ev.value,
        }));
      });
    settings
      .addBinding(config, "width", {
        label: "width (px)",
        min: 80,
        max: 500,
        step: 1,
      })
      .on("change", (ev) => {
        setConfig((prev) => ({
          ...prev,
          width: ev.value,
        }));
      });
    settings
      .addBinding(config, "height", {
        label: "height (px)",
        min: 80,
        max: 500,
        step: 1,
      })
      .on("change", (ev) => {
        setConfig((prev) => ({
          ...prev,
          height: ev.value,
        }));
      });
    settings
      .addBinding(config, "radius", {
        label: "radius (px)",
        min: 0,
        max: 500,
        step: 1,
      })
      .on("change", (ev) => {
        setConfig((prev) => ({
          ...prev,
          radius: ev.value,
        }));
      });
    settings
      .addBinding(config, "border", {
        label: "border",
        min: 0,
        max: 1,
        step: 0.01,
      })
      .on("change", (ev) => {
        setConfig((prev) => ({
          ...prev,
          border: ev.value,
        }));
      });
    settings
      .addBinding(config, "alpha", {
        label: "alpha",
        min: 0,
        max: 1,
        step: 0.01,
      })
      .on("change", (ev) => {
        setConfig((prev) => ({
          ...prev,
          alpha: ev.value,
        }));
      });
    settings
      .addBinding(config, "lightness", {
        label: "lightness",
        min: 0,
        max: 100,
        step: 1,
      })
      .on("change", (ev) => {
        setConfig((prev) => ({
          ...prev,
          lightness: ev.value,
        }));
      });
    settings
      .addBinding(config, "blur", {
        label: "input blur",
        min: 0,
        max: 20,
        step: 1,
      })
      .on("change", (ev) => {
        setConfig((prev) => ({
          ...prev,
          blur: ev.value,
        }));
      });

    settings
      .addBinding(config, "displace", {
        label: "output blur",
        min: 0,
        max: 100,
        step: 1,
      })
      .on("change", (ev) => {
        setConfig((prev) => ({
          ...prev,
          displace: ev.value,
        }));
      });
    settings
      .addBinding(config, "x", {
        label: "channel x",
        options: {
          r: "R",
          g: "G",
          b: "B",
        },
      })
      .on("change", (ev) => {
        setConfig((prev) => ({
          ...prev,
          x: ev.value,
        }));
      });
    settings
      .addBinding(config, "y", {
        label: "channel y",
        options: {
          r: "R",
          g: "G",
          b: "B",
        },
      })
      .on("change", (ev) => {
        setConfig((prev) => ({
          ...prev,
          y: ev.value,
        }));
      });
    settings
      .addBinding(config, "blend", {
        options: {
          normal: "normal",
          multiply: "multiply",
          screen: "screen",
          overlay: "overlay",
          darken: "darken",
          lighten: "lighten",
          "color-dodge": "color-dodge",
          "color-burn": "color-burn",
          "hard-light": "hard-light",
          "soft-light": "soft-light",
          difference: "difference",
          exclusion: "exclusion",
          hue: "hue",
          saturation: "saturation",
          color: "color",
          luminosity: "luminosity",
          "plus-lighter": "plus-lighter",
          "plus-darker": "plus-darker",
        },
        label: "blend",
      })
      .on("change", (ev) => {
        setConfig((prev) => ({
          ...prev,
          blend: ev.value,
        }));
      });
    settings
      .addBinding(config, "scale", {
        label: "scale",
        min: -1000,
        max: 1000,
        step: 1,
      })
      .on("change", (ev) => {
        setConfig((prev) => ({
          ...prev,
          scale: ev.value,
        }));
      });

    return () => ctrl.dispose();
  }, []);

  useEffect(() => {
    update();
  }, [config]);

  return (
    <div className="effect" ref={effectRef}>
      <div className="nav-wrap">
        <nav>
          <img src="https://assets.codepen.io/605876/finder.png" alt="finder" />
          <img
            src="https://assets.codepen.io/605876/launch-control.png"
            alt="launch-control"
          />
          <img src="https://assets.codepen.io/605876/safari.png" alt="safari" />
          <img
            src="https://assets.codepen.io/605876/calendar.png"
            alt="calender"
          />
        </nav>
      </div>
      <svg className="filter" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="filter" colorInterpolationFilters="sRGB">
            {/* the input displacement image */}
            <feImage
              x="0"
              y="0"
              width="100%"
              height="100%"
              result="map"
            ></feImage>
            {/* the displacement map to use */}
            <feDisplacementMap in2="map" in="SourceGraphic" />
          </filter>
        </defs>
      </svg>
      <div className="displacement-debug" ref={debugRef}></div>
    </div>
  );
};

export default index;
