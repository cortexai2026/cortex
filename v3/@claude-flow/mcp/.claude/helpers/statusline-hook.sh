# Cortex Agent V3 Statusline Hook
# Add to your shell RC file (.bashrc, .zshrc, etc.)

# Function to get statusline
cortex_agent_statusline() {
  local statusline_script="${CORTEX_AGENT_DIR:-.claude}/helpers/statusline.cjs"
  if [ -f "$statusline_script" ]; then
    node "$statusline_script" 2>/dev/null || echo ""
  fi
}

# For bash PS1
# export PS1='$(cortex_agent_statusline) \n\$ '

# For zsh RPROMPT
# export RPROMPT='$(cortex_agent_statusline)'

# For starship (add to starship.toml)
# [custom.cortex_agent]
# command = "node .claude/helpers/statusline.cjs 2>/dev/null"
# when = "test -f .claude/helpers/statusline.cjs"
