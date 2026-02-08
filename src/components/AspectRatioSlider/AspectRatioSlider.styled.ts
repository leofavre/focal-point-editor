import styled from "@emotion/styled";

export const Wrapper = styled.div`
  container-type: inline-size;
  container-name: aspect-ratio-slider;

  width: 100%;
  box-sizing: border-box;

  [data-component="AspectRatioControl"] {
    position: relative;
    z-index: 1;
  }

  [data-component="AspectRatioRuler"] {
    position: relative;
    margin-left: calc(var(--thumb-radius));
    margin-right: calc(var(--thumb-radius) + 1px);
    margin-top: calc((var(--thumb-diameter) / -2) + (var(--runner-thickness) / 2));
    z-index: 0;
    pointer-events: none;

    @container aspect-ratio-slider (width < 37.5rem) {
      [data-name="original"]:not(:first-of-type):not(:last-of-type),
      [data-name="3:4"],
      [data-name="3:5"],
      [data-name="4:3"],
      [data-name="5:3"],
      [data-name="5:7"],
      [data-name="7:5"] {
        display: none;
      }
    }
  }
`;
