import React, { useState, useEffect } from 'react';
import { dataQualityService } from '../services/dataQuality';
import { DataGuardrailsConfig, CustomValidationRule } from '../types';
import './DataGuardrailsSettings.css';

export const DataGuardrailsSettings: React.FC = () => {
  const [config, setConfig] = useState<DataGuardrailsConfig>(dataQualityService.getConfig());
  const [newRule, setNewRule] = useState<Partial<CustomValidationRule>>({
    name: '',
    condition: '',
    action: 'warning',
    enabled: true
  });
  const [showAddRule, setShowAddRule] = useState(false);

  useEffect(() => {
    setConfig(dataQualityService.getConfig());
  }, []);

  const handleModeChange = (mode: 'strict' | 'web_scraping' | 'custom') => {
    dataQualityService.setMode(mode);
    setConfig(dataQualityService.getConfig());
  };

  const handleConfigUpdate = (field: keyof DataGuardrailsConfig, value: any) => {
    const updates = { [field]: value };
    dataQualityService.updateConfig(updates);
    setConfig(dataQualityService.getConfig());
  };

  const handleAddCustomRule = () => {
    if (newRule.name && newRule.condition && newRule.action) {
      const rule: CustomValidationRule = {
        id: `rule_${Date.now()}`,
        name: newRule.name,
        condition: newRule.condition,
        action: newRule.action as any,
        enabled: newRule.enabled || true
      };
      dataQualityService.addCustomRule(rule);
      setConfig(dataQualityService.getConfig());
      setNewRule({ name: '', condition: '', action: 'warning', enabled: true });
      setShowAddRule(false);
    }
  };

  const handleRemoveRule = (ruleId: string) => {
    dataQualityService.removeCustomRule(ruleId);
    setConfig(dataQualityService.getConfig());
  };

  const handleToggleRule = (ruleId: string, enabled: boolean) => {
    dataQualityService.updateCustomRule(ruleId, { enabled });
    setConfig(dataQualityService.getConfig());
  };

  const handleResetTracking = () => {
    if (confirm('Reset all source tracking and blacklists? This cannot be undone.')) {
      dataQualityService.resetSourceTracking();
      alert('Source tracking reset successfully');
    }
  };

  return (
    <div className="data-guardrails-settings">
      <h2>⚙️ Data Quality Guardrails</h2>
      <p className="settings-description">
        Configure data validation rules to ensure high-quality, reliable analysis results.
      </p>

      {/* Mode Selection */}
      <div className="settings-section">
        <h3>Guardrail Mode</h3>
        <div className="mode-selector">
          <button
            className={`mode-button ${config.mode === 'strict' ? 'active' : ''}`}
            onClick={() => handleModeChange('strict')}
          >
            <span className="mode-icon">🔒</span>
            <div>
              <strong>Strict Defaults</strong>
              <small>Recommended for high-stakes decisions</small>
            </div>
          </button>

          <button
            className={`mode-button ${config.mode === 'web_scraping' ? 'active' : ''}`}
            onClick={() => handleModeChange('web_scraping')}
          >
            <span className="mode-icon">🌐</span>
            <div>
              <strong>Web Scraping</strong>
              <small>Looser guardrails for scraped data</small>
            </div>
          </button>

          <button
            className={`mode-button ${config.mode === 'custom' ? 'active' : ''}`}
            onClick={() => handleModeChange('custom')}
          >
            <span className="mode-icon">⚡</span>
            <div>
              <strong>Custom</strong>
              <small>Configure your own thresholds</small>
            </div>
          </button>
        </div>
      </div>

      {/* Custom Configuration (only visible in custom mode) */}
      {config.mode === 'custom' && (
        <>
          {/* Max Age Settings */}
          <div className="settings-section">
            <h3>⏰ Maximum Data Age (minutes)</h3>
            <div className="settings-grid">
              <div className="setting-item">
                <label>Price Data</label>
                <input
                  type="number"
                  value={config.maxPriceAge}
                  onChange={(e) => handleConfigUpdate('maxPriceAge', parseInt(e.target.value))}
                  min="1"
                />
              </div>

              <div className="setting-item">
                <label>Supply Data</label>
                <input
                  type="number"
                  value={config.maxSupplyAge}
                  onChange={(e) => handleConfigUpdate('maxSupplyAge', parseInt(e.target.value))}
                  min="1"
                />
              </div>

              <div className="setting-item">
                <label>Volume Data</label>
                <input
                  type="number"
                  value={config.maxVolumeAge}
                  onChange={(e) => handleConfigUpdate('maxVolumeAge', parseInt(e.target.value))}
                  min="1"
                />
              </div>

              <div className="setting-item">
                <label>On-Chain Data</label>
                <input
                  type="number"
                  value={config.maxOnChainDataAge}
                  onChange={(e) => handleConfigUpdate('maxOnChainDataAge', parseInt(e.target.value))}
                  min="1"
                />
              </div>

              <div className="setting-item">
                <label>Social Data</label>
                <input
                  type="number"
                  value={config.maxSocialDataAge}
                  onChange={(e) => handleConfigUpdate('maxSocialDataAge', parseInt(e.target.value))}
                  min="1"
                />
              </div>

              <div className="setting-item">
                <label>Dev Activity Data</label>
                <input
                  type="number"
                  value={config.maxDevActivityAge}
                  onChange={(e) => handleConfigUpdate('maxDevActivityAge', parseInt(e.target.value))}
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Consensus Settings */}
          <div className="settings-section">
            <h3>🎯 Consensus Configuration</h3>
            <div className="settings-grid">
              <div className="setting-item">
                <label>Minimum Sources Required</label>
                <input
                  type="number"
                  value={config.minConsensusSources}
                  onChange={(e) => handleConfigUpdate('minConsensusSources', parseInt(e.target.value))}
                  min="1"
                  max="10"
                />
              </div>

              <div className="setting-item">
                <label>Consensus Method</label>
                <select
                  value={config.consensusMethod}
                  onChange={(e) => handleConfigUpdate('consensusMethod', e.target.value)}
                >
                  <option value="median">Median (Recommended)</option>
                  <option value="mean">Mean (Average)</option>
                  <option value="mode">Mode (Most Common)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Deviation Thresholds */}
          <div className="settings-section">
            <h3>📊 Maximum Relative Deviation (%)</h3>
            <div className="settings-grid">
              <div className="setting-item">
                <label>Price Deviation</label>
                <input
                  type="number"
                  value={config.maxPriceRelativeDeviation}
                  onChange={(e) => handleConfigUpdate('maxPriceRelativeDeviation', parseFloat(e.target.value))}
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="setting-item">
                <label>Supply Deviation</label>
                <input
                  type="number"
                  value={config.maxSupplyRelativeDeviation}
                  onChange={(e) => handleConfigUpdate('maxSupplyRelativeDeviation', parseFloat(e.target.value))}
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="setting-item">
                <label>Volume Deviation</label>
                <input
                  type="number"
                  value={config.maxVolumeRelativeDeviation}
                  onChange={(e) => handleConfigUpdate('maxVolumeRelativeDeviation', parseFloat(e.target.value))}
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
          </div>

          {/* Outlier Detection */}
          <div className="settings-section">
            <h3>🔍 Outlier Detection</h3>
            <div className="settings-grid">
              <div className="setting-item">
                <label>Outlier Detection Rule</label>
                <select
                  value={config.outlierRule}
                  onChange={(e) => handleConfigUpdate('outlierRule', e.target.value)}
                >
                  <option value="mad">Median Absolute Deviation (MAD)</option>
                  <option value="iqr">Interquartile Range (IQR)</option>
                  <option value="custom">Custom Validation Logic</option>
                </select>
              </div>

              <div className="setting-item">
                <label>Auto-Blacklist After Stale Count</label>
                <input
                  type="number"
                  value={config.autoBlacklistAfterStaleCount}
                  onChange={(e) => handleConfigUpdate('autoBlacklistAfterStaleCount', parseInt(e.target.value))}
                  min="1"
                  max="10"
                />
              </div>
            </div>
          </div>

          {/* Custom Validation Rules */}
          <div className="settings-section">
            <h3>🛠️ Custom Validation Rules</h3>

            {config.customRules.length > 0 && (
              <div className="custom-rules-list">
                {config.customRules.map((rule) => (
                  <div key={rule.id} className="custom-rule-item">
                    <div className="rule-header">
                      <input
                        type="checkbox"
                        checked={rule.enabled}
                        onChange={(e) => handleToggleRule(rule.id, e.target.checked)}
                      />
                      <strong>{rule.name}</strong>
                      <button
                        className="remove-rule-btn"
                        onClick={() => handleRemoveRule(rule.id)}
                        title="Remove rule"
                      >
                        ×
                      </button>
                    </div>
                    <div className="rule-details">
                      <span className="rule-condition">Condition: <code>{rule.condition}</code></span>
                      <span className="rule-action">Action: {rule.action.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!showAddRule ? (
              <button className="add-rule-btn" onClick={() => setShowAddRule(true)}>
                + Add Custom Rule
              </button>
            ) : (
              <div className="add-rule-form">
                <input
                  type="text"
                  placeholder="Rule name"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Condition (e.g., volume < 500000)"
                  value={newRule.condition}
                  onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
                />
                <select
                  value={newRule.action}
                  onChange={(e) => setNewRule({ ...newRule, action: e.target.value as any })}
                >
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                  <option value="disregard_price_deviation">Disregard Price Deviation</option>
                  <option value="blacklist_source">Blacklist Source</option>
                </select>
                <div className="add-rule-actions">
                  <button onClick={handleAddCustomRule}>Add Rule</button>
                  <button onClick={() => setShowAddRule(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Source Management */}
      <div className="settings-section">
        <h3>📋 Source Management</h3>
        <div className="source-management">
          <div className="blacklisted-sources">
            <strong>Blacklisted Sources:</strong>
            {dataQualityService.getBlacklistedSources().length > 0 ? (
              <ul>
                {dataQualityService.getBlacklistedSources().map(source => (
                  <li key={source}>
                    {source}
                    <button onClick={() => {
                      dataQualityService.unblacklistSource(source);
                      setConfig({ ...config }); // Force re-render
                    }}>
                      Unblacklist
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No blacklisted sources</p>
            )}
          </div>
          <button className="reset-tracking-btn" onClick={handleResetTracking}>
            Reset All Source Tracking
          </button>
        </div>
      </div>

      {/* Current Configuration Summary */}
      <div className="settings-section config-summary">
        <h3>📄 Current Configuration</h3>
        <div className="config-summary-grid">
          <div><strong>Mode:</strong> {config.mode}</div>
          <div><strong>Price Age Limit:</strong> {config.maxPriceAge} min</div>
          <div><strong>Min Sources:</strong> {config.minConsensusSources}</div>
          <div><strong>Consensus Method:</strong> {config.consensusMethod}</div>
          <div><strong>Price Deviation:</strong> ±{config.maxPriceRelativeDeviation}%</div>
          <div><strong>Outlier Rule:</strong> {config.outlierRule.toUpperCase()}</div>
        </div>
      </div>
    </div>
  );
};
