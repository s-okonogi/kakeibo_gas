function doGet(e) {
  const template = HtmlService.createTemplateFromFile("monthly_high");
  const html_output = template.evaluate();
  html_output.setTitle("月間支出高");
  return html_output;
}
