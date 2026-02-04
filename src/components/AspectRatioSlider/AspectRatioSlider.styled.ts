import styled from "@emotion/styled";

export const Wrapper = styled.div`
  --thumb-radius: 0.75rem;
  --thumb-diameter: calc(2 * var(--thumb-radius));
  --thumb-border: 2px;
  --runner-thickness: 4px;

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
    margin-top: calc(var(--thumb-diameter) / -2);
    z-index: 0;

    @container aspect-ratio-slider (width < 37.5rem) {
      [data-name="3:4"] { display: none; }
      [data-name="3:5"] { display: none; }
      [data-name="4:3"] { display: none; }
      [data-name="5:3"] { display: none; }
      [data-name="5:7"] { display: none; }
      [data-name="7:5"] { display: none; }
    }
  }
`;
