export default function switchTool({ controlName, toolName }) {
  const startingControl = ui.controls.activeControl;
  const startingTool = ui.controls.activeTool;
  const control = ui.controls.controls.find((c) => c.name === controlName);
  ui.controls.activeControl = controlName;
  ui.controls.controls.find((c) => c.name === controlName).activeTool = toolName;
  canvas.layers.find((layer) => layer.name === control.layer).activate();
  ui.controls.render();
  return { controlName: startingControl, toolName: startingTool };
}
