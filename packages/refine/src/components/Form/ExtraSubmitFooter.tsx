import { Button, Typo } from '@cloudtower/eagle';
import {
  ArrowChevronLeft16BoldBlueIcon,
  ExclamationErrorCircleFill16RedIcon,
} from '@cloudtower/icons-react';
import { css, cx } from '@linaria/core';
import { omit } from 'lodash-es';
import React, { useMemo } from 'react';
import { RefineFormConfig } from 'src/types';
import { type SaveButtonProps } from './FormModal';

const FooterStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
const FooterLeftStyle = css`
  display: flex;
  align-items: center;
  min-width: 0;
`;
const FooterRightStyle = css`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const ErrorStyle = css`
  display: inline-flex;
  align-items: center;
  min-width: 0;
  color: var(--color-red-6);
`;
const ErrorIconStyle = css`
  flex: none;
  margin-right: 4px;
`;
const PrevIconStyle = css`
  margin-right: 4px;
`;

interface ExtraSubmitFooterProps {
  cancelText: React.ReactNode;
  errorText: React.ReactNode;
  extraSubmitText: React.ReactNode;
  nextStepText: React.ReactNode;
  prevText: React.ReactNode;
  saveButtonProps: SaveButtonProps;
  showPrevButton: boolean;
  onCancel: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onSubmit: (e: React.BaseSyntheticEvent) => void;
}

interface UseExtraSubmitFooterOptions {
  action: 'create' | 'edit';
  cancelText: React.ReactNode;
  defaultSubmitText: React.ReactNode;
  errorText: React.ReactNode;
  extraSubmitButton?: RefineFormConfig['extraSubmitButton'];
  fallbackFooter?: React.ReactNode;
  isYamlMode: boolean;
  nextStepText: React.ReactNode;
  prevStepText: React.ReactNode;
  saveButtonProps: SaveButtonProps;
  step: number;
  stepCount: number;
  onCancel: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onSubmit: (e: React.BaseSyntheticEvent) => void;
}

export function useExtraSubmitFooter({
  action,
  cancelText,
  defaultSubmitText,
  errorText,
  extraSubmitButton,
  fallbackFooter,
  isYamlMode,
  nextStepText,
  prevStepText,
  saveButtonProps,
  step,
  stepCount,
  onCancel,
  onNextStep,
  onPrevStep,
  onSubmit,
}: UseExtraSubmitFooterOptions) {
  const shouldShowExtraSubmitButton = useMemo(() => {
    // 额外提交按钮只在配置的表单模式、操作类型和步骤上出现；最后一步已有默认提交按钮，因此始终隐藏。
    if (!extraSubmitButton || isYamlMode) {
      return false;
    }
    if (extraSubmitButton.action && extraSubmitButton.action !== action) {
      return false;
    }
    if (extraSubmitButton.step !== step) {
      return false;
    }

    return step < stepCount - 1;
  }, [action, extraSubmitButton, isYamlMode, step, stepCount]);

  return useMemo(() => {
    if (!shouldShowExtraSubmitButton) {
      return fallbackFooter;
    }

    return (
      <ExtraSubmitFooter
        cancelText={cancelText}
        errorText={errorText}
        extraSubmitText={extraSubmitButton?.text || defaultSubmitText}
        nextStepText={nextStepText}
        prevText={prevStepText}
        saveButtonProps={saveButtonProps}
        showPrevButton={step > 0}
        onCancel={onCancel}
        onNextStep={onNextStep}
        onPrevStep={onPrevStep}
        onSubmit={onSubmit}
      />
    );
  }, [
    cancelText,
    defaultSubmitText,
    errorText,
    extraSubmitButton?.text,
    fallbackFooter,
    onCancel,
    onNextStep,
    onPrevStep,
    onSubmit,
    nextStepText,
    prevStepText,
    saveButtonProps,
    shouldShowExtraSubmitButton,
    step,
  ]);
}

const ExtraSubmitFooter: React.FC<ExtraSubmitFooterProps> = ({
  cancelText,
  errorText,
  extraSubmitText,
  nextStepText,
  prevText,
  saveButtonProps,
  showPrevButton,
  onCancel,
  onNextStep,
  onPrevStep,
  onSubmit,
}) => {
  const finalSaveButtonProps = omit(saveButtonProps, 'onClick');

  // WizardDialog 没有右侧额外按钮插槽，因此仅在需要快捷提交时复刻默认 footer，并保留原有错误、取消和上一步行为。
  return (
    <div className={FooterStyle}>
      <div className={FooterLeftStyle}>
        {showPrevButton ? (
          <Button type="link" onClick={onPrevStep}>
            <ArrowChevronLeft16BoldBlueIcon className={PrevIconStyle} />
            {prevText}
          </Button>
        ) : null}
        {errorText ? (
          <span className={cx(ErrorStyle, Typo.Label.l2_regular)}>
            <ExclamationErrorCircleFill16RedIcon className={ErrorIconStyle} />
            {errorText}
          </span>
        ) : null}
      </div>
      <div className={FooterRightStyle}>
        <Button type="quiet" size="large" onClick={onCancel}>
          <span className={Typo.Label.l1_bold_title}>{cancelText}</span>
        </Button>
        <Button
          size="large"
          type="secondary"
          onClick={onNextStep}
        >
          {nextStepText}
        </Button>
        <Button
          {...finalSaveButtonProps}
          size="large"
          type="primary"
          onClick={onSubmit}
        >
          {/* 直接复用 onSubmit，确保快捷提交也走 transformApplyValues、beforeSubmit 和成功关闭逻辑。 */}
          {extraSubmitText}
        </Button>
      </div>
    </div>
  );
};
