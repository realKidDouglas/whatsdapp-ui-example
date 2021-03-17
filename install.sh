#pull submodule
git submodule update --init

#install whatsdapp-lib
whatsdapp_dir="./whatsdapp-lib"
#cd whatsdapp-lib && npm install && npm rebuild grpc --runtime=electron --target=v10.1.4 && npm run dist
npm --prefix ${whatsdapp_dir} ci ${whatsdapp_dir}
npm --prefix ${whatsdapp_dir} rebuild grpc --runtime=electron --target=v10.1.4 
npm --prefix ${whatsdapp_dir} run dist

#install GUI
#cd .. && 
npm ci 
npm ci grpc --runtime=electron --target=v10.1.4
npm rebuild grpc --runtime=electron --target=v10.1.4
