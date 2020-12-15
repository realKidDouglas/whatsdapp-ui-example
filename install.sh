#pull submodule
git submodule update --init

#install whatsdapp-lib
whatsdapp-dir="./whatsdapp-lib"
#cd whatsdapp-lib && npm install && npm rebuild grpc --runtime=electron --target=v10.1.4 && npm run dist
npm --prefix ${whatsdapp-dir} install ${whatsdapp-dir}
npm --prefix ${whatsdapp-dir} rebuild grpc --runtime=electron --target=v10.1.4 
npm --prefix ${whatsdapp-dir} run dist

#install GUI
#cd .. && 
npm install 
npm install grpc --runtime=electron --target=v10.1.4
