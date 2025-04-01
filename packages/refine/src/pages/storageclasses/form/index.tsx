import { Select, AntdOption } from '@cloudtower/eagle';
import React, { useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import { renderCommonFormFiled } from 'src/components/Form/RefineFormContent';
import { RefineFormFieldRenderProps } from 'src/components/Form/type';
import i18n from 'src/i18n';
import { StorageClassModel } from 'src/models';
import { FormType, ResourceConfig } from 'src/types';

type GenerateStorageClassFormConfig = {
  isEnabledProvisionerA?: boolean;
  isEnabledProvisionerB?: boolean;
  isVmKsc?: boolean;
};

function NameField(props: RefineFormFieldRenderProps) {
  const { control, field, trigger } = props;
  const { onChange } = field;
  const provisioner = useWatch({
    control,
    name: 'provisioner',
  });
  const fstype = useWatch({
    control,
    name: 'parameters.fstype',
  });

  useEffect(() => {
    if (provisioner === 'provisioner.a') {
      onChange('a');
    } else if (provisioner === 'provisioner.b') {
      onChange('b');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provisioner]);
  useEffect(() => {
    if (fstype) {
      trigger('metadata.name');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fstype]);

  return renderCommonFormFiled(props);
}

export function generateStorageClassFormConfig(
  options: GenerateStorageClassFormConfig
): ResourceConfig<StorageClassModel>['formConfig'] {
  const { isEnabledProvisionerA, isVmKsc, isEnabledProvisionerB } = options;

  return {
    formType: FormType.FORM,
    fields() {
      return [
        {
          path: ['metadata', 'name'],
          key: 'name',
          label: i18n.t('dovetail.name'),
          disabledWhenEdit: true,
          validators: [
            value => {
              let error = '';

              if (!value) {
                error = i18n.t('sks.name_can_not_be_empty');
              }

              return {
                isValid: !error,
                errorMsg: error,
              };
            },
          ],
          render(props) {
            return <NameField {...props} />;
          },
        },
        {
          path: ['provisioner'],
          key: 'provisioner',
          label: i18n.t('dovetail.provisioner'),
          render(props) {
            const { field } = props;
            const { value, onChange } = field;
            const options = [
              {
                label: 'a',
                value: 'provisioner.a',
                disabled: !isEnabledProvisionerA,
                storageId: 'a',
              },
            ];

            if (isVmKsc) {
              options.unshift({
                label: 'b',
                value: 'provisioner.b',
                disabled: !isEnabledProvisionerB,
                storageId: 'b',
              });
            }

            return (
              <Select
                input={{
                  value,
                  onChange,
                }}
              >
                {options.map(option => (
                  <AntdOption
                    key={option.value}
                    value={option.value}
                    label={option.label}
                  >
                    {option.label}
                  </AntdOption>
                ))}
              </Select>
            );
          },
          validators: [
            value => {
              let error = '';

              if (!value) {
                error = i18n.t('sks.required_provisioner');
              } else if (
                !/(^[a-z0-9]$)|(^[a-z0-9][a-z0-9-.]*?[a-z0-9]$)/.test(value as string)
              ) {
                error = i18n.t('sks.provisioner_format_limit');
              }

              return {
                isValid: !error,
                errorMsg: error,
              };
            },
          ],
          helperText: i18n.t('sks.provisioner_tip'),
        },
        {
          path: ['parameters', 'fstype'],
          key: 'fstype',
          label: i18n.t('dovetail.fstype'),
          condition: (formValue) => {
            return formValue.provisioner === 'provisioner.a';
          },
          render(props) {
            const { field } = props;
            const { value, onChange } = field;
            const options = [
              {
                label: 'ext4',
                value: 'ext4',
              },
              {
                label: 'ext2',
                value: 'ext2',
              },
              {
                label: 'ext3',
                value: 'ext3',
              },
              {
                label: 'xfs',
                value: 'xfs',
              },
            ];

            return (
              <Select
                input={{
                  value,
                  onChange,
                }}
              >
                {options.map(option => (
                  <AntdOption
                    key={option.value}
                    value={option.value}
                    label={option.label}
                  >
                    {option.label}
                  </AntdOption>
                ))}
              </Select>
            );
          },
          validators: [
            value => {
              let error = '';

              if (!value) {
                error = i18n.t('sks.required_fstype');
              }

              return {
                isValid: !error,
                errorMsg: error,
              };
            },
          ],
        },
      ];
    },
  };
}
