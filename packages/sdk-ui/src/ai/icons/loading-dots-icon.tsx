import styled from '@emotion/styled';
import { useChatStyle } from '../chat-style-provider';

const Dot = styled.div<{ color?: string }>`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  animation: hop 0.9s ease-out infinite;

  &:nth-child(2) {
    animation-delay: 0.1s;
  }

  &:nth-child(3) {
    animation-delay: 0.2s;
  }

  &:nth-child(4) {
    animation-delay: 0.3s;
  }

  @keyframes hop {
    0%,
    40% {
      transform: translateY(0);
    }
    20% {
      transform: translateY(-100%);
    }
  }
`;

export default function LoadingDotsIcon() {
  const style = useChatStyle();
  const color = style.iconColor ?? '#505050';

  return (
    <div
      className="csdk-flex csdk-justify-between csdk-w-[28px] csdk-py-[14.5px]"
      aria-label="loading dots"
    >
      <Dot color={color} />
      <Dot color={color} />
      <Dot color={color} />
      <Dot color={color} />
    </div>
  );
}
