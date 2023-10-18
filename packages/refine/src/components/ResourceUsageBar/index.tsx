import { css, cx } from '@linaria/core';
import React from 'react';
import { parseSi } from 'src/utils/unit';

type Props = {
  usage: string;
  requestNum: number;
  limitNum: number;
};

const WrapperStyle = css`
  display: flex;
  align-items: center;

  .usage-text {
    width: 50px;
    text-align: right;
  }

  .usage-bar {
    height: 12px;
    width: 100px;
    position: relative;
    border-radius: 2px;
  }

  .request-anchor {
    position: absolute;
    left: 10%;
    top: -3px;
    height: 18px;
    width: 2px;
    background: #777;
    z-index: 9;
  }

  .usage-fill-bar {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: rgba(0, 128, 255, 0.6);
    z-index: 7;
  }

  .request-bar {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: #d8deeb;
    z-index: 5;
  }

  .request-to-limit-bar {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    background: #d8deeb;
    z-index: 5;

    &.no-limit {
      background: linear-gradient(to right, #d8deeb 50%, #d8deeb 50%);
      background-size: 4px 100%;

      &.exceed-request {
        background: linear-gradient(to right, #d8deeb 50%, rgba(0, 128, 255, 0.6) 50%);
        background-size: 4px 100%;
      }
    }
  }
`;

const InnerBar: React.FC<Props> = ({ usage, requestNum, limitNum }) => {
  const usageNum = parseSi(usage);
  const totalNum = limitNum || requestNum / 0.8;
  const requestPercent = (100 * requestNum) / totalNum;
  const usageInRequestPercent = 100 * Math.min(usageNum / requestNum, 1);
  const usageInRequestToLimitPercent =
    100 * Math.min(Math.max(usageNum - requestNum, 0) / (totalNum - requestNum), 1);
  const noLimit = limitNum === 0;

  return (
    <div className="usage-bar" style={{ marginLeft: 4 }}>
      <div
        className="request-anchor"
        style={{
          left: `${requestPercent}%`,
        }}
      ></div>
      <div className="request-bar" style={{ width: `${requestPercent}%` }}>
        <div
          className="usage-fill-bar"
          style={{ width: `${usageInRequestPercent}%` }}
        ></div>
      </div>
      <div
        className={cx(
          'request-to-limit-bar',
          noLimit && 'no-limit',
          usageInRequestToLimitPercent > 0 && 'exceed-request'
        )}
        style={{ width: `${100 - requestPercent}%` }}
      >
        {!noLimit && (
          <div
            className="usage-fill-bar"
            style={{ width: `${usageInRequestToLimitPercent}%` }}
          ></div>
        )}
      </div>
    </div>
  );
};

export const ResourceUsageBar: React.FC<Props> = props => {
  const { usage, requestNum } = props;

  return (
    <div className={cx('usage-wrapper', WrapperStyle)}>
      <div className="usage-text">{usage}</div>
      {requestNum > 0 && <InnerBar {...props} />}
    </div>
  );
};
