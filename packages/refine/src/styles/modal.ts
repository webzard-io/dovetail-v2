import { css } from '@linaria/core';


export const FullscreenModalStyle = css`
  &.ant-modal.fullscreen {
    .ant-modal-header {
      padding: 60px 0 32px 0;
      max-width: var(--max-modal-width, 1024px);
      width: 100%;
      margin: auto;
    }

    .ant-modal-body {
      padding: 0 4px;
      max-width: var(--max-modal-width, 1024px);
      width: 100%;
      margin: auto;
    }

    .ant-modal-footer {
      .footer-content {
        padding: 0;
        max-width: var(--max-modal-width, 1024px);
        width: 100%;
        margin: auto;
      }
    }
  }
`;

export const SmallModalStyle = css`
&.ant-modal.normal-modal {
  .ant-modal-content {
    width: 492px;
    border-radius: 16px;
  }

  .ant-modal-body {
    padding: 32px 40px;
    min-height: 160px;
    overflow-x: hidden;
  }

  .ant-modal-header {
    border-radius: 16px 16px 0 0;
    padding: 32px 40px;
    padding-bottom: 0;
  }

  .ant-modal-footer {
    padding: 24px 40px;
  }

  .ant-modal-close-x {
    top: 35px;
    right: 40px;
  }
}
`;
