function init_map() {
	console.log("script.js loaded");
    	const map = L.map('mapcontainer');

    	//初期の中心位置とズームレベルを設定
    	map.setView([34.262447, 131.620091], 10); 

    	//マップタイルを読み込み、引用元を記載する
    	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
        	{attribution: "<a href='http://osm.org/copyright'> ©OpenStreetMap </a>"}
    	).addTo(map);

	//マーカー情報→ファイルlocationsに別で保存

	//マーカー表示
	for(const key in locations){
		const loc = locations[key];
		if (key === "condition_front") continue;
		const marker = L.marker(loc.latlng)
			.bindPopup(loc.name)
			.addTo(map);
		marker.on('mouseover', () => marker.openPopup());
	}

  	//プルダウン（点）の処理
  	const selectPoint = document.getElementById('myPointSelect');
  	selectPoint.addEventListener('change', function() {
  		const val = this.value;
		const loc =locations[val]
		console.log(val, locations[val]);
		if (loc) map.setView(loc.latlng, Number(loc.zoom));
	});

	//経路を追加
	const routeLayers={};
	let nowRoute
	for (const key in routes){
		const r=routes[key];
		const routeLayer=L.geoJSON(r.geometry,{style:{color:"blue",weight:4}});

		routeLayers[key]=routeLayer;
	}
	nowRoute=null
	L.control.layers(null,routeLayers).addTo(map);
	
	//プルダウン（経路）の処理
	const selectRoute=document.getElementById("myRouteSelect");
	selectRoute.addEventListener("change",function(){
		const val=this.value;
		const object=routes[val];
		console.log(val);
		removeRoute(nowRoute);
		if(val==="All"){
			for (const key in routes){
				routeLayers[key].addTo(map);
			}
			nowRoute="All";
		}else{
			nowRoute=val;
			routeLayers[val].addTo(map);
		}
	})

	function removeRoute(nowRoute){
		if(nowRoute===null){
			return;
		}else if(nowRoute==="All"){
			for (const key in routes){
				routeLayers[key].remove();
			}
		}else{
			routeLayers[nowRoute].remove();
		}
	}

	//スケール（メートル）の追加
	L.control.scale({imperial: false, metric: true}).addTo(map);
}

//ダウンロード時に初期化する
window.addEventListener('DOMContentLoaded', init_map);
