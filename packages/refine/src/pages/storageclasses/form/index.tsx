import { Select, AntdOption } from '@cloudtower/eagle';
import React from 'react';
import i18n from 'src/i18n';
import { StorageClassModel } from 'src/models';
import { FormType, ResourceConfig } from 'src/types';

type GenerateStorageClassFormConfig = {
  isEnabledZbs?: boolean;
  isEnabledElf?: boolean;
  isVmKsc?: boolean;
}

export function generateStorageClassFormConfig(options: GenerateStorageClassFormConfig): ResourceConfig<StorageClassModel>['formConfig'] {
  const {
    isEnabledZbs,
    isVmKsc,
    isEnabledElf
  } = options;

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
            (value) => {
              let error = '';

              if (!value) {
                error = i18n.t('sks.required_fstype');
              }

              return {
                isValid: !error,
                errorMsg: error
              };
            }
          ]
        },
        {
          path: ['provisioner'],
          key: 'provisioner',
          label: i18n.t('dovetail.provisioner'),
          render(value, onChange) {
            const options = [
              {
                'label': i18n.t('sks.zbs_csi'),
                'value': 'com.smartx.zbs-csi-driver',
                'disabled': !isEnabledZbs,
                'storageId': 'zbs'
              }
            ];

            if (isVmKsc) {
              options.unshift({
                'label': i18n.t('sks.elf_csi'),
                'value': 'com.smartx.elf-csi-driver',
                'disabled': !isEnabledElf,
                'storageId': 'elf'
              });
            }


            return (
              <Select
                input={{
                  value,
                  onChange
                }}
              >
                {
                  options.map(option => (
                    <AntdOption key={option.value} value={option.value} label={option.label}>{option.label}</AntdOption>
                  ))
                }
              </Select>
            );
          },
          validators: [
            (value) => {
              let error = '';

              if (!value) {
                error = i18n.t('sks.required_provisioner');
              } else if (!/(^[a-z0-9]$)|(^[a-z0-9][a-z0-9-.]*?[a-z0-9]$)/.test(value as string)) {
                error = i18n.t('sks.provisioner_format_limit');
              }

              return {
                isValid: !error,
                errorMsg: error
              };
            }
          ],
          helperText: i18n.t('sks.provisioner_tip')
        },
        {
          path: ['parameters', 'fstype'],
          key: 'fstype',
          label: i18n.t('dovetail.fstype'),
          render(value, onChange) {
            const options = [
              {
                'label': 'ext4',
                'value': 'ext4'
              },
              {
                'label': 'ext2',
                'value': 'ext2'
              },
              {
                'label': 'ext3',
                'value': 'ext3'
              },
              {
                'label': 'xfs',
                'value': 'xfs'
              }
            ];

            return (
              <Select
                input={{
                  value,
                  onChange
                }}
              >
                {
                  options.map(option => (
                    <AntdOption key={option.value} value={option.value} label={option.label}>{option.label}</AntdOption>
                  ))
                }
              </Select>
            );
          },
          validators: [
            (value) => {
              let error = '';

              if (!value) {
                error = i18n.t('sks.required_fstype');
              }

              return {
                isValid: !error,
                errorMsg: error
              };
            }
          ]
        },
      ];
    }
  };
}
