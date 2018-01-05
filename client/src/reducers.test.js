// @flow

import cloneDeep from 'lodash/clonedeep';
import upperFirst from 'lodash/upperfirst';
import {reducer, reduxSetup} from 'redux-easy';

import initialState from './initial-state';
import './reducers';

import type {AddNodePayloadType, NodePayloadType, NodeType} from './types';

describe('reducer', () => {
  const ROOT_ID = 1;
  const kind = 'type';
  let state;

  beforeEach(() => {
    state = cloneDeep(initialState);
    reduxSetup({initialState: state});
  });

  function testSetTopProp(prop: string) {
    const payload = ['foo', 'bar'];
    const action = {type: 'set' + upperFirst(prop), payload};
    state = reducer(state, action);
    expect(state[prop]).toEqual(payload);
  }

  function testSetUiProp(prop: string) {
    const type = 'set' + upperFirst(prop);
    const payload = true;
    const action = {type, payload};
    state = reducer(state, action);
    expect(state.ui[prop]).toBe(payload);
  }

  function testSetUserProp(prop: string) {
    const type = 'set' + upperFirst(prop);
    const payload = 'some value';
    const action = {type, payload};
    state = reducer(state, action);
    expect(state.user[prop]).toBe(payload);
  }

  function addRootNode() {
    // Add root node.
    const parentId = ROOT_ID;
    const typeNode = {
      id: parentId,
      name: 'root',
      children: []
    };
    const typeNodeMap = {[parentId]: typeNode};
    return {...state, typeNodeMap};
  }

  test('addNode 1 level deep', () => {
    let newState = addRootNode();

    // Add a child node to root node.
    const childId = 2;
    const name = 'new node';
    const payload = {id: childId, kind: 'type', name, parentId: ROOT_ID};
    const action = {type: 'addNode', payload};
    newState = reducer(newState, action);

    const {typeNodeMap} = newState;
    const childNode = typeNodeMap[childId];
    expect(childNode.name).toBe(name);
    expect(childNode.parentId).toBe(ROOT_ID);
    expect(childNode.children.length).toBe(0);

    const parentNode = typeNodeMap[ROOT_ID];
    expect(parentNode.children).toEqual([childId]);
  });

  test('addNode 2 levels deep', () => {
    let newState = addRootNode();

    // Add a parent node.
    const parentId = 2;
    let payload = {
      id: parentId,
      kind: 'type',
      name: 'some parent',
      parentId: ROOT_ID
    };
    let action = {type: 'addNode', payload};
    newState = reducer(newState, action);

    // Add a child node.
    const childId = 3;
    const childName = 'child node';
    payload = {id: childId, kind: 'type', name: childName, parentId};
    action = {type: 'addNode', payload};
    newState = reducer(newState, action);

    const {typeNodeMap} = newState;
    const childNode = typeNodeMap[childId];
    expect(childNode.id).toBe(childId);
    expect(childNode.name).toBe(childName);
    expect(childNode.parentId).toBe(parentId);
    expect(childNode.children.length).toBe(0);

    const parentNode = typeNodeMap[parentId];
    expect(parentNode.children).toEqual([childId]);
  });

  test('deleteNode 1 level deep', () => {
    let newState = addRootNode();

    // Add a node.
    const nodeId = 2;
    const name = 'new node';
    const payload: AddNodePayloadType = {
      id: nodeId,
      kind,
      name,
      parentId: ROOT_ID
    };
    let action = {type: 'addNode', payload};
    newState = reducer(newState, action);

    // Get the new node.
    const {typeNodeMap} = newState;
    const node = typeNodeMap[nodeId];
    expect(node).toBeDefined();

    // Delete the node that was added.
    const payload2: NodePayloadType = {kind, node};
    action = {type: 'deleteNode', payload: payload2};
    newState = reducer(newState, action);
    expect(newState.typeNodeMap[nodeId]).not.toBeDefined();
  });

  test('deleteNode 2 levels deep', () => {
    let newState = addRootNode();

    // Add a child node to root node.
    const childId = 2;
    const name = 'new node';
    const payload = {id: childId, kind: 'type', name, parentId: ROOT_ID};
    let action = {type: 'addNode', payload};
    newState = reducer(newState, action);
    const {typeNodeMap} = newState;
    const node = typeNodeMap[childId];

    // Delete the child node that was added.
    const payload2: NodePayloadType = {kind, node};
    action = {type: 'deleteNode', payload: payload2};
    newState = reducer(newState, action);
    expect(newState.typeNodeMap[childId]).not.toBeDefined();
  });

  test('setAllAlerts', () => testSetTopProp('allAlerts'));
  test('setInstanceAlerts', () => testSetTopProp('instanceAlerts'));
  test('setInstanceData', () => testSetTopProp('instanceData'));

  test('setConfirmEmail', () => testSetUserProp('confirmEmail'));
  test('setConfirmPassword', () => testSetUserProp('confirmPassword'));
  test('setEmail', () => testSetUserProp('email'));
  test('setFirstName', () => testSetUserProp('firstName'));
  test('setLastName', () => testSetUserProp('lastName'));
  test('setPassword', () => testSetUserProp('password'));
  test('setPhone', () => testSetUserProp('phone'));

  test('setModal', () => testSetUiProp('modal'));
  test('setNewPropName', () => testSetUiProp('newPropName'));
  test('setNewPropType', () => testSetUiProp('newPropType'));

  test('setSelectedChildNode', () => {
    const id = 999;
    const node: NodeType = {
      id,
      children: [],
      name: 'some node',
      parentId: 0
    };
    const action = {type: 'setSelectedChildNode', payload: node};
    let newState = reducer(state, action);
    expect(newState.ui.selectedChildNodeId).toBe(id);

    // Toggle off.
    newState = reducer(newState, action);
    expect(newState.ui.selectedChildNodeId).toBe(0);
  });

  test('setSelectedNode', () => {
    const id = 999;
    const node: NodeType = {
      id,
      children: [],
      name: 'some node',
      parentId: 0
    };
    const payload: NodePayloadType = {kind, node};
    const action = {type: 'setSelectedNode', payload};
    let newState = reducer(state, action);
    expect(newState.ui.selectedTypeNodeId).toBe(id);

    // Toggle off.
    newState = reducer(newState, action);
    expect(newState.ui.selectedTypeNodeId).toBe(0);
  });
});
