import { css } from '@linaria/core';


export const FullscreenModalStyle = css`
  &.ant-modal.fullscreen {
    .ant-modal-header {
      padding: 60px 128px 32px 128px;
    }

    .ant-modal-body {
      padding: 0 128px;
    }

    .ant-modal-footer {
      .footer-content {
        margin: 0 128px;
      }
    }
  }
`;
