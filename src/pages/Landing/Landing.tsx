import { css } from "@emotion/react";
import { Cell, LandingGrid, MosaicGrid, Title } from "./Landing.styled";

export default function Landing() {
  return (
    <LandingGrid>
      <Title data-component="Title">Focus Point Manager</Title>
      <MosaicGrid data-component="MosaicGrid">
        <Cell css={css`grid-column: span 2; aspect-ratio: unset;`}>1</Cell>
        <Cell>2</Cell>
        <Cell>3</Cell>
        <Cell>4</Cell>
        <Cell css={css`grid-row: span 2; aspect-ratio: unset;`}>5</Cell>
        <Cell>6</Cell>
        <Cell>7</Cell>
        <Cell>8</Cell>
        <Cell>9</Cell>
        <Cell>10</Cell>
        <Cell css={css`grid-row: span 2; aspect-ratio: unset;`}>11</Cell>
        <Cell>12</Cell>
        <Cell>13</Cell>
        <Cell>14</Cell>
        <Cell>15</Cell>
        <Cell>16</Cell>
        <Cell>17</Cell>
        <Cell>18</Cell>
      </MosaicGrid>
    </LandingGrid>
  );
}
