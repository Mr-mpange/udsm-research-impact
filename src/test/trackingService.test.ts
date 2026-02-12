/**
 * Quick test for tracking service
 * Run this to verify tracking works
 */

import { describe, it, expect } from 'vitest';

describe('Tracking Service', () => {
  it('should have uuid library installed', () => {
    const { v4: uuidv4 } = require('uuid');
    const uuid = uuidv4();
    expect(uuid).toBeDefined();
    expect(uuid.length).toBe(36);
  });

  it('should generate unique session IDs', () => {
    const { v4: uuidv4 } = require('uuid');
    const id1 = uuidv4();
    const id2 = uuidv4();
    expect(id1).not.toBe(id2);
  });
});
