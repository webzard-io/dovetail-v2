import { i18n } from 'i18next';
import { ExtendObjectMeta } from 'k8s-api-provider';
import { Condition } from 'kubernetes-types/meta/v1';
import React from 'react';
import { JobModel, ResourceModel, WorkloadModel } from '../../model';
import { ConditionsTable } from '../ConditionsTable';
import { CronjobJobsTable } from '../CronjobJobsTable';
import { ImageNames } from '../ImageNames';
import { KeyValue } from '../KeyValue';
import Time from '../Time';
import { WorkloadPodsTable } from '../WorkloadPodsTable';
import { WorkloadReplicas } from '../WorkloadReplicas';
import { ShowField } from '../../types';

export const ImageField = (i18n: i18n): ShowField<WorkloadModel> => {
  return {
    key: 'Image',
    title: i18n.t('image'),
    path: ['imageNames'],
    render(value) {
      return <ImageNames value={value as string[]} />;
    },
  };
};

export const ReplicaField = (i18n: i18n): ShowField<WorkloadModel> => {
  return {
    key: 'Replicas',
    title: i18n.t('replicas'),
    path: ['status', 'replicas'],
    render: (_, record) => {
      return <WorkloadReplicas record={record} />;
    },
  };
};

export const ConditionsField = (i18n: i18n): ShowField<ResourceModel> => {
  return {
    key: 'Conditions',
    title: i18n.t('condition'),
    path: ['status', 'conditions'],
    render: value => {
      return <ConditionsTable conditions={value as Condition[]} />;
    },
  };
};

export const PodsField = (_: i18n): ShowField<WorkloadModel> => {
  return {
    key: 'pods',
    title: 'Pods',
    path: [],
    render: (_, record) => {
      return (
        <WorkloadPodsTable
          selector={
            (record.metadata as ExtendObjectMeta).relations?.find(r => {
              return r.kind === 'Pod' && r.type === 'creates';
            })?.selector
          }
        />
      );
    },
  };
};

export const JobsField = (_: i18n): ShowField<WorkloadModel> => {
  return {
    key: 'jobs',
    title: 'Jobs',
    path: [],
    render: (_, record) => {
      return (
        <CronjobJobsTable
          owner={{
            apiVersion: record.apiVersion || '',
            kind: record.kind || '',
            name: record.metadata?.name || '',
            namespace: record.metadata?.namespace || '',
            uid: record.metadata?.uid || '',
          }}
        />
      );
    },
  };
};

export const DataField = (i18n: i18n): ShowField<ResourceModel> => {
  return {
    key: 'data',
    title: i18n.t('data'),
    path: ['rawYaml', 'data'],
    render: val => {
      return <KeyValue value={val as Record<string, string>} />;
    },
  };
};

export const SecretDataField = (i18n: i18n): ShowField<ResourceModel> => {
  return {
    key: 'data',
    title: i18n.t('data'),
    path: ['rawYaml', 'data'],
    render: val => {
      const decodeVal: Record<string, string> = {};
      for (const key in val as Record<string, string>) {
        decodeVal[key] = atob((val as Record<string, string>)[key]);
      }
      return <KeyValue value={decodeVal} />;
    },
  };
};

export const StartTimeField = (i18n: i18n): ShowField<JobModel> => {
  return {
    key: 'started',
    title: i18n.t('started'),
    path: ['status', 'startTime'],
    render(value) {
      return <Time date={value as string} />;
    },
  };
};

export const ServiceTypeField = (i18n: i18n): ShowField<ResourceModel> => {
  return {
    key: 'type',
    title: i18n.t('dovetail.type'),
    path: ['rawYaml', 'spec', 'type'],
  };
};

export const ClusterIpField = (i18n: i18n): ShowField<ResourceModel> => {
  return {
    key: 'clusterIp',
    title: i18n.t('dovetail.clusterIp'),
    path: ['rawYaml', 'spec', 'clusterIP'],
  };
};

export const SessionAffinityField = (i18n: i18n): ShowField<ResourceModel> => {
  return {
    key: 'clusterIp',
    title: i18n.t('dovetail.sessionAffinity'),
    path: ['rawYaml', 'spec', 'sessionAffinity'],
  };
};

export const ServicePodsField = (_: i18n): ShowField<ResourceModel> => {
  return {
    key: 'pods',
    title: 'Pods',
    path: [],
    render: (_, record) => {
      return (
        <WorkloadPodsTable
          selector={
            (record.metadata as ExtendObjectMeta).relations?.find(r => {
              return r.kind === 'Pod' && r.type === 'selects';
            })?.selector
          }
        />
      );
    },
  };
};
import { Collapse, List, Tabs, Tag } from 'antd';
import { get } from 'lodash';

const { TabPane } = Tabs;

const PortList: React.FC<{ ports: Array<{ port: number; protocol: string }> }> = ({
  ports,
}) => {
  return (
    <List
      bordered
      dataSource={ports}
      renderItem={portItem => (
        <List.Item className="flex justify-between">
          <span>{portItem.port}</span>
          <Tag>{portItem.protocol}</Tag>
        </List.Item>
      )}
    />
  );
};

const RuleList: React.FC<{ ruleType: string; data: any }> = ({ ruleType, data }) => {
  switch (ruleType) {
    case 'ipBlock':
      return (
        <div>
          <div>
            <strong>CIDR:</strong> {data.cidr}
          </div>
          {data.except && (
            <div>
              <strong>Except:</strong> {data.except.join(', ')}
            </div>
          )}
        </div>
      );
    case 'namespaceSelector':
    case 'podSelector':
      // The rendering for namespaceSelector and podSelector would be similar,
      // with keys being the label names and the values being the label values
      const selectorPairs = Object.entries(data.matchLabels || {});
      return (
        <List
          bordered
          dataSource={selectorPairs}
          renderItem={item => (
            <List.Item className="max-w-20">
              <span className="text-600-blue m-1 p-1">{item[0]}:</span> {item[1]}
            </List.Item>
          )}
        />
      );
    default:
      return null;
  }
};

export const IngressEgressField = (i18n: i18n): ShowField<ResourceModel> => {
  return {
    key: 'ingress-egress',
    title: i18n.t('ingress-egress'),
    path: ['rawYaml'],
    render: yaml => {
      const ingress = get(yaml, 'spec.ingress', []) as Array<any>;
      const egress = get(yaml, 'spec.egress', []) as Array<any>;

      return (
        <Tabs defaultActiveKey="1" className="mb-5">
          <TabPane tab="Ingress" key="1">
            {ingress.map((ing, i) => (
              <Collapse defaultActiveKey="0" key={i}>
                <Collapse.Panel header={`Ingress ${i + 1}`} key="1">
                  <Tabs defaultActiveKey="1">
                    {ing.from.map((fromItem, index) => {
                      const ruleType = fromItem.ipBlock
                        ? 'ipBlock'
                        : fromItem.namespaceSelector
                        ? 'namespaceSelector'
                        : 'podSelector';

                      return (
                        <TabPane tab={ruleType} key={String(index)}>
                          <RuleList ruleType={ruleType} data={fromItem[ruleType]} />
                        </TabPane>
                      );
                    })}
                    <TabPane tab="Ports" key="ports">
                      <PortList ports={get(ing, 'ports', [])} />
                    </TabPane>
                  </Tabs>
                </Collapse.Panel>
              </Collapse>
            ))}
          </TabPane>
          <TabPane tab="Egress" key="2">
            {egress.map((eg, i) => (
              <Collapse defaultActiveKey="0" key={i}>
                <Collapse.Panel header={`Egress ${i + 1}`} key="1">
                  <Tabs defaultActiveKey="1">
                    {eg.to
                      .map((toItem, index) => {
                        const ruleType = toItem.ipBlock
                          ? 'ipBlock'
                          : toItem.namespaceSelector
                          ? 'namespaceSelector'
                          : 'podSelector';

                        if (ruleType === 'ipBlock') {
                          return (
                            <TabPane tab={ruleType} key={String(index)}>
                              <RuleList ruleType={ruleType} data={toItem[ruleType]} />
                            </TabPane>
                          );
                        }

                        return null;
                      })
                      .filter(tab => tab)}
                    <TabPane tab="Ports" key="ports">
                      <PortList ports={get(eg, 'ports', [])} />
                    </TabPane>
                  </Tabs>
                </Collapse.Panel>
              </Collapse>
            ))}
          </TabPane>
        </Tabs>
      );
    },
  };
};
