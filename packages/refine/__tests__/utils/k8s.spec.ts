import { pruneBeforeEdit } from '../../src/utils/k8s';

describe('pruneBeforeEdit', () => {
  it('removes id field', () => {
    const item = {
      id: 'test-id',
      metadata: {
        name: 'test',
      },
    };
    pruneBeforeEdit(item);
    expect(item.id).toBeUndefined();
  });

  it('removes metadata.relations field', () => {
    const item = {
      id: 'test-id',
      metadata: {
        name: 'test',
        relations: [
          {
            kind: 'Pod',
            apiVersion: 'v1',
            type: 'creates',
            selector: { matchLabels: { app: 'test' } },
            inbound: false,
          },
        ],
      },
    };
    pruneBeforeEdit(item);
    expect(item.metadata.relations).toBeUndefined();
  });

  it('preserves other metadata fields when removing relations', () => {
    const item = {
      id: 'test-id',
      metadata: {
        name: 'test',
        namespace: 'default',
        labels: { app: 'test' },
        relations: [{ kind: 'Pod', apiVersion: 'v1', type: 'creates', inbound: false }],
      },
    };
    pruneBeforeEdit(item);
    expect(item.metadata.name).toBe('test');
    expect(item.metadata.namespace).toBe('default');
    expect(item.metadata.labels).toEqual({ app: 'test' });
    expect(item.metadata.relations).toBeUndefined();
  });

  it('handles item without metadata', () => {
    const item = {
      id: 'test-id',
    };
    expect(() => pruneBeforeEdit(item)).not.toThrow();
    expect(item.id).toBeUndefined();
  });

  it('handles item with metadata but without relations', () => {
    const item = {
      id: 'test-id',
      metadata: {
        name: 'test',
      },
    };
    expect(() => pruneBeforeEdit(item)).not.toThrow();
    expect(item.metadata.name).toBe('test');
  });
});
