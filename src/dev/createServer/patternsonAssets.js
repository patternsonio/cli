export default function patternsonAssets(fs) {
  return (req, res) => {
    try {
      const content = fs.readFileSync(`/<v-root>/www/build${req.url}`);
      res.setHeader('Content-Length', content.length);
      res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
      res.end(content);
    } catch (e) {
      res.statusCode = 404;
      res.end('Not Found');
    }
  };
}
