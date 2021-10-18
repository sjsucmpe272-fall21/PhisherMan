
import Server from "./Server";
import { ArgumentParser } from "argparse";

const argparser = new ArgumentParser({});
argparser.add_argument('-p', '--port', { help: 'Port to run server on' });
const args = argparser.parse_args();

const server = new Server(args.port);
server.start();
