import { useState } from 'react';
import { Printer, Wifi, Bluetooth, Usb, File, Coins, CheckCircle, ArrowLeft } from 'lucide-react';

export default function PrintKioskUI() {
  const [step, setStep] = useState<string>('start'); // start, connection, upload, layout, summary, payment, complete
  const [connectionType, setConnectionType] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [orientation, setOrientation] = useState<string>('portrait');
  const [paperSize, setPaperSize] = useState<string>('a4');
  const [colorMode, setColorMode] = useState<string>('bw');
  const [pages, setPages] = useState<string>('all');
  const [pageRange, setPageRange] = useState<string>('1-10');
  const [copies, setCopies] = useState<number>(1);
  const [insertedCoins, setInsertedCoins] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('coins'); // coins, gcash
  const [connectionState, setConnectionState] = useState<string>('idle'); // idle, connecting, connected
  const [availableDevices, setAvailableDevices] = useState<any[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);

  const pricePerPage = colorMode === 'color' ? 5 : 2; // 5 pesos for color, 2 for B&W
  
  // Calculate actual pages based on selection
  const calculatePages = () => {
    if (pages === 'all') return 10;
    if (pages === 'range') {
      // Parse page range (e.g., "1-5, 8, 10")
      const parts = pageRange.split(',').map(p => p.trim());
      let count = 0;
      parts.forEach(part => {
        if (part.includes('-')) {
          const [start, end] = part.split('-').map(n => parseInt(n.trim()));
          count += (end - start + 1);
        } else {
          count += 1;
        }
      });
      return Math.max(1, count);
    }
    return 10;
  };
  
  const totalPages = calculatePages();
  const totalCost = totalPages * copies * pricePerPage;

  const simulateBluetooth = () => {
    setConnectionState('connecting');
    // Simulate device scanning
    setTimeout(() => {
      setAvailableDevices([
        { id: 1, name: "John's iPhone", type: 'iOS' },
        { id: 2, name: "Samsung Galaxy S23", type: 'Android' },
        { id: 3, name: "iPad Pro", type: 'iOS' }
      ]);
      setConnectionState('scanning');
    }, 1500);
  };

  const handleBluetoothPair = (device: any) => {
    setSelectedDevice(device);
    setConnectionState('pairing');
    setTimeout(() => {
      setConnectionState('connected');
    }, 2000);
  };

  const simulateUSB = () => {
    setConnectionState('connecting');
    setTimeout(() => {
      setConnectionState('reading');
      setTimeout(() => {
        setAvailableDevices([
          { id: 1, name: "Document1.pdf", size: "2.4 MB", icon: "pdf" },
          { id: 2, name: "Presentation.pptx", size: "5.1 MB", icon: "ppt" },
          { id: 3, name: "Report.docx", size: "1.8 MB", icon: "doc" },
          { id: 4, name: "Image.jpg", size: "3.2 MB", icon: "img" }
        ]);
        setConnectionState('ready');
      }, 1500);
    }, 1000);
  };

  const simulateCloud = () => {
    setConnectionState('qr_code');
    // Simulate user scanning QR and logging in
    setTimeout(() => {
      setConnectionState('authenticating');
      setTimeout(() => {
        setAvailableDevices([
          { id: 1, name: "Work Documents", type: "folder", items: 24 },
          { id: 2, name: "Q4_Report.pdf", type: "file", size: "3.2 MB" },
          { id: 3, name: "Meeting_Notes.docx", type: "file", size: "1.1 MB" },
          { id: 4, name: "Photos", type: "folder", items: 156 }
        ]);
        setConnectionState('ready');
      }, 2000);
    }, 5000);
  };

  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file.name);
      setTimeout(() => setStep('layout'), 500);
    }
  };

  const handleSelectFile = (file: any) => {
    setUploadedFile(file.name);
    setTimeout(() => setStep('layout'), 800);
  };

  const handleInsertCoin = (amount: number) => {
    setInsertedCoins(prev => prev + amount);
  };

  const renderStart = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-6 md:p-8 mb-4 md:mb-6 shadow-2xl">
        <Printer className="w-16 h-16 md:w-20 md:h-20 text-white" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-3 text-center">Print Kiosk Go</h1>
      <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base text-center px-4">Fast & Easy Printing Service</p>
      <button
        onClick={() => setStep('connection')}
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-full text-base md:text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all active:scale-95"
      >
        Start Printing
      </button>
    </div>
  );

  const renderConnection = () => (
    <div className="flex flex-col h-full py-2 md:py-4">
      <button onClick={() => setStep('start')} className="self-start mb-3 md:mb-4 inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">Choose Connection Method</h2>
      <p className="text-gray-600 mb-4 md:mb-6 text-xs md:text-sm">How would you like to send your document?</p>
      
      <div className="grid grid-cols-1 gap-2 md:gap-3 flex-1 overflow-y-auto">
        <button
          onClick={() => {
            setConnectionType('cloud');
            simulateCloud();
            setStep('upload');
          }}
          className="bg-white p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-500 flex items-start md:items-center gap-4"
        >
          <div className="bg-blue-100 p-3 md:p-4 rounded-xl flex-shrink-0">
            <Wifi className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
          </div>
          <div className="text-left">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">Cloud Storage</h3>
            <p className="text-sm md:text-base text-gray-600">Google Drive, Dropbox, OneDrive</p>
          </div>
        </button>

        <button
          onClick={() => {
            setConnectionType('bluetooth');
            simulateBluetooth();
            setStep('upload');
          }}
          className="bg-white p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-500 flex items-start md:items-center gap-4"
        >
          <div className="bg-purple-100 p-3 md:p-4 rounded-xl flex-shrink-0">
            <Bluetooth className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
          </div>
          <div className="text-left">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">Bluetooth</h3>
            <p className="text-sm md:text-base text-gray-600">Send from your phone or tablet</p>
          </div>
        </button>

        <button
          onClick={() => {
            setConnectionType('usb');
            simulateUSB();
            setStep('upload');
          }}
          className="bg-white p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-green-500 flex items-start md:items-center gap-4"
        >
          <div className="bg-green-100 p-3 md:p-4 rounded-xl flex-shrink-0">
            <Usb className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
          </div>
          <div className="text-left">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">USB Drive</h3>
            <p className="text-sm md:text-base text-gray-600">Insert your USB flash drive</p>
          </div>
        </button>
      </div>
    </div>
  );

  const renderUpload = () => {
    const connectionInfo: any = {
      cloud: { icon: Wifi, color: 'blue', text: 'Cloud Storage' },
      bluetooth: { icon: Bluetooth, color: 'purple', text: 'Bluetooth Connection' },
      usb: { icon: Usb, color: 'green', text: 'USB Drive' }
    };
    const info = connectionInfo[connectionType as string];
    const Icon = info.icon;

    return (
      <div className="flex flex-col h-full">
        <button onClick={() => {
          setStep('connection');
          setConnectionState('idle');
          setAvailableDevices([]);
          setSelectedDevice(null);
        }} className="self-start mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        <div className="flex flex-col flex-1">
          <div className="flex items-center mb-3 md:mb-4">
            <div className={`bg-${info.color}-100 p-2 md:p-3 rounded-lg mr-3`}>
              <Icon className={`w-6 h-6 md:w-7 md:h-7 text-${info.color}-600`} />
            </div>
            <h2 className="text-lg md:text-xl font-bold text-gray-800">{info.text}</h2>
          </div>

          {/* BLUETOOTH FLOW */}
          {connectionType === 'bluetooth' && (
            <>
              {connectionState === 'connecting' && (
                <div className="flex flex-col items-center justify-center flex-1 py-6 md:py-0">
                  <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-sm md:max-w-lg mx-4 text-center">
                    <div className="relative mb-6 inline-block">
                      <Bluetooth className="w-20 h-20 text-purple-600" />
                      <div className="absolute inset-0 animate-ping">
                        <Bluetooth className="w-20 h-20 text-purple-400 opacity-75" />
                      </div>
                    </div>
                    <p className="text-xl font-semibold text-gray-800">Searching for devices...</p>
                  </div>
                </div>
              )}

              {connectionState === 'scanning' && (
                <div className="flex flex-col items-center justify-center flex-1 py-6 md:py-0">
                  <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-sm md:max-w-lg mx-4">
                    <p className="text-lg font-semibold text-gray-800 mb-4 text-center">Available devices:</p>
                    <div className="space-y-3">
                      {availableDevices.map(device => (
                        <button
                          key={device.id}
                          onClick={() => handleBluetoothPair(device)}
                          className="w-full bg-white p-4 rounded-xl shadow hover:shadow-lg transition-all border-2 border-gray-200 hover:border-purple-500 flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                              <Bluetooth className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="text-left">
                              <p className="font-semibold text-gray-800">{device.name}</p>
                              <p className="text-sm text-gray-500">{device.type} Device</p>
                            </div>
                          </div>
                          <span className="text-purple-600 font-semibold">Pair</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {connectionState === 'pairing' && (
                <div className="flex flex-col items-center justify-center flex-1 py-6 md:py-0">
                  <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-sm md:max-w-lg mx-4 text-center">
                    <Bluetooth className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-pulse" />
                    <p className="text-xl font-semibold text-gray-800">Pairing with {selectedDevice?.name}...</p>
                    <p className="text-gray-600 mt-2">Please confirm on your device</p>
                  </div>
                </div>
              )}

              {connectionState === 'connected' && (
                <div className="flex flex-col items-center justify-center flex-1 py-6 md:py-0">
                  <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-sm md:max-w-lg mx-4 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <p className="text-xl font-semibold text-gray-800 mb-2">Connected to {selectedDevice?.name}</p>
                    <p className="text-gray-600 mb-6">Send your file from your device now</p>
                    <label className="cursor-pointer bg-purple-600 text-white px-6 py-3 rounded-lg inline-block hover:bg-purple-700 transition-all">
                      <span>Select File </span>
                      <input type="file" className="hidden" onChange={handleFileUpload} />
                    </label>
                  </div>
                </div>
              )}
            </>
          )}

          {/* USB FLOW */}
          {connectionType === 'usb' && (
            <>
              {connectionState === 'connecting' && (
                <div className="flex flex-col items-center justify-center flex-1 py-6 md:py-0">
                  <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-sm md:max-w-lg mx-4 text-center">
                    <Usb className="w-20 h-20 text-green-600 animate-bounce mb-6 mx-auto" />
                    <p className="text-xl font-semibold text-gray-800">Detecting USB drive...</p>
                  </div>
                </div>
              )}

              {connectionState === 'reading' && (
                <div className="flex flex-col items-center justify-center flex-1 py-6 md:py-0">
                  <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-sm md:max-w-lg mx-4 text-center">
                    <Usb className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <p className="text-xl font-semibold text-gray-800 mb-4">Reading USB contents...</p>
                    <div className="w-64 bg-gray-200 rounded-full h-2 mx-auto">
                      <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
                    </div>
                  </div>
                </div>
              )}

              {connectionState === 'ready' && (
                <div className="flex flex-col items-center justify-center flex-1 py-6 md:py-0">
                  <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-sm md:max-w-lg mx-4">
                    <p className="text-lg font-semibold text-gray-800 mb-4 text-center">Files on USB drive:</p>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                    {availableDevices.map(file => (
                      <button
                        key={file.id}
                        onClick={() => handleSelectFile(file)}
                        className="w-full bg-white p-4 rounded-xl shadow hover:shadow-lg transition-all border-2 border-gray-200 hover:border-green-500 flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                            <File className="w-6 h-6 text-green-600" />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-gray-800">{file.name}</p>
                            <p className="text-sm text-gray-500">{file.size}</p>
                          </div>
                        </div>
                        <span className="text-green-600 font-semibold">Select</span>
                      </button>
                    ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* CLOUD FLOW */}
          {connectionType === 'cloud' && (
            <>
              {connectionState === 'qr_code' && (
                <div className="flex flex-col items-center justify-center flex-1 py-2 md:py-0">
                  <div className="bg-white p-4 md:p-6 rounded-3xl shadow-2xl w-full max-w-6xl mx-4">
                    <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-2 text-center">Scan to Connect</h3>
                    <p className="text-xs md:text-sm text-gray-600 mb-3 text-center">Use your phone camera to scan this QR code</p>
                    
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                      {/* QR Code */}
                      <div className="bg-white p-3 md:p-4 border-4 border-blue-500 rounded-2xl flex justify-center flex-shrink-0">
                        <svg viewBox="0 0 200 200" className="w-32 h-32 md:w-48 md:h-48">
                        <rect width="200" height="200" fill="white"/>
                        <rect x="10" y="10" width="50" height="50" fill="black"/><rect x="20" y="20" width="30" height="30" fill="white"/>
                        <rect x="140" y="10" width="50" height="50" fill="black"/><rect x="150" y="20" width="30" height="30" fill="white"/>
                        <rect x="10" y="140" width="50" height="50" fill="black"/><rect x="20" y="150" width="30" height="30" fill="white"/>
                        <rect x="70" y="10" width="10" height="10" fill="black"/><rect x="90" y="10" width="10" height="10" fill="black"/>
                        <rect x="110" y="10" width="10" height="10" fill="black"/><rect x="80" y="20" width="10" height="10" fill="black"/>
                        <rect x="100" y="20" width="10" height="10" fill="black"/><rect x="70" y="30" width="10" height="10" fill="black"/>
                        <rect x="90" y="30" width="10" height="10" fill="black"/><rect x="110" y="30" width="10" height="10" fill="black"/>
                        <rect x="10" y="70" width="10" height="10" fill="black"/><rect x="30" y="70" width="10" height="10" fill="black"/>
                        <rect x="50" y="70" width="10" height="10" fill="black"/><rect x="70" y="70" width="10" height="10" fill="black"/>
                        <rect x="90" y="70" width="10" height="10" fill="black"/><rect x="110" y="70" width="10" height="10" fill="black"/>
                        <rect x="130" y="70" width="10" height="10" fill="black"/><rect x="150" y="70" width="10" height="10" fill="black"/>
                        <rect x="170" y="70" width="10" height="10" fill="black"/><rect x="20" y="80" width="10" height="10" fill="black"/>
                        <rect x="40" y="80" width="10" height="10" fill="black"/><rect x="80" y="80" width="10" height="10" fill="black"/>
                        <rect x="120" y="80" width="10" height="10" fill="black"/><rect x="160" y="80" width="10" height="10" fill="black"/>
                        <rect x="180" y="80" width="10" height="10" fill="black"/><rect x="10" y="90" width="10" height="10" fill="black"/>
                        <rect x="50" y="90" width="10" height="10" fill="black"/><rect x="70" y="90" width="10" height="10" fill="black"/>
                        <rect x="110" y="90" width="10" height="10" fill="black"/><rect x="130" y="90" width="10" height="10" fill="black"/>
                        <rect x="170" y="90" width="10" height="10" fill="black"/><rect x="30" y="100" width="10" height="10" fill="black"/>
                        <rect x="60" y="100" width="10" height="10" fill="black"/><rect x="100" y="100" width="10" height="10" fill="black"/>
                        <rect x="140" y="100" width="10" height="10" fill="black"/><rect x="180" y="100" width="10" height="10" fill="black"/>
                        <rect x="20" y="110" width="10" height="10" fill="black"/><rect x="40" y="110" width="10" height="10" fill="black"/>
                        <rect x="80" y="110" width="10" height="10" fill="black"/><rect x="120" y="110" width="10" height="10" fill="black"/>
                        <rect x="160" y="110" width="10" height="10" fill="black"/><rect x="10" y="120" width="10" height="10" fill="black"/>
                        <rect x="50" y="120" width="10" height="10" fill="black"/><rect x="90" y="120" width="10" height="10" fill="black"/>
                        <rect x="130" y="120" width="10" height="10" fill="black"/><rect x="170" y="120" width="10" height="10" fill="black"/>
                        <rect x="70" y="140" width="10" height="10" fill="black"/><rect x="90" y="140" width="10" height="10" fill="black"/>
                        <rect x="110" y="140" width="10" height="10" fill="black"/><rect x="130" y="140" width="10" height="10" fill="black"/>
                        <rect x="150" y="140" width="10" height="10" fill="black"/><rect x="170" y="140" width="10" height="10" fill="black"/>
                        <rect x="80" y="150" width="10" height="10" fill="black"/><rect x="100" y="150" width="10" height="10" fill="black"/>
                        <rect x="140" y="150" width="10" height="10" fill="black"/><rect x="160" y="150" width="10" height="10" fill="black"/>
                        <rect x="180" y="150" width="10" height="10" fill="black"/><rect x="70" y="160" width="10" height="10" fill="black"/>
                        <rect x="110" y="160" width="10" height="10" fill="black"/><rect x="130" y="160" width="10" height="10" fill="black"/>
                        <rect x="170" y="160" width="10" height="10" fill="black"/><rect x="90" y="170" width="10" height="10" fill="black"/>
                        <rect x="110" y="170" width="10" height="10" fill="black"/><rect x="150" y="170" width="10" height="10" fill="black"/>
                        <rect x="180" y="170" width="10" height="10" fill="black"/><rect x="70" y="180" width="10" height="10" fill="black"/>
                        <rect x="100" y="180" width="10" height="10" fill="black"/><rect x="130" y="180" width="10" height="10" fill="black"/>
                        <rect x="160" y="180" width="10" height="10" fill="black"/>
                      </svg>
                      </div>

                      {/* Right side info */}
                      <div className="flex flex-col justify-center flex-1">
                        {/* Session Code */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 md:p-3 rounded-lg mb-2">
                          <p className="text-white text-xs mb-0.5 text-center">Session Code</p>
                          <p className="text-white text-xl md:text-2xl font-bold text-center tracking-wider">KS-8247</p>
                        </div>

                        <div className="bg-blue-50 p-2 md:p-3 rounded-lg mb-2">
                          <p className="text-xs text-gray-700 text-center mb-0.5">
                            <strong>Or visit:</strong> print.kiosk.com
                          </p>
                          <p className="text-xs text-gray-600 text-center">
                            Enter the session code
                          </p>
                        </div>

                        {/* Steps */}
                        <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded-lg">
                          <p className="font-semibold mb-1">Steps:</p>
                          <ol className="list-decimal list-inside text-xs text-gray-600 space-y-0.5">
                            <li>Scan QR code or visit print.kiosk.com</li>
                            <li>Log into Google Drive, Dropbox, or OneDrive</li>
                            <li>Select files to print</li>
                          </ol>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-1 md:gap-2 mt-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                      </div>
                      <p className="text-gray-600 text-xs">Waiting for connection...</p>
                    </div>
                  </div>
                </div>
              )}

              {connectionState === 'authenticating' && (
                <div className="flex flex-col items-center justify-center flex-1 py-6 md:py-0">
                  <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-sm md:max-w-lg mx-4 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <p className="text-xl font-semibold text-gray-800 mb-2">QR Code Scanned!</p>
                    <p className="text-gray-600 mb-4">Authenticating with cloud storage...</p>
                    <div className="flex items-center justify-center gap-2">
                      <Wifi className="w-6 h-6 text-blue-600 animate-pulse" />
                      <div className="w-48 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {connectionState === 'ready' && (
                <div className="flex flex-col items-center justify-center flex-1 py-6 md:py-0">
                  <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-sm md:max-w-lg mx-4">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-gray-700 font-semibold">Your files:</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                        Connected
                      </div>
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                    {availableDevices.map(item => (
                      <button
                        key={item.id}
                        onClick={() => item.type === 'file' && handleSelectFile(item)}
                        disabled={item.type === 'folder'}
                        className={`w-full bg-white p-4 rounded-xl shadow hover:shadow-lg transition-all border-2 border-gray-200 ${item.type === 'file' ? 'hover:border-blue-500' : 'opacity-60'} flex items-center justify-between`}
                      >
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                            {item.type === 'folder' ? (
                              <div className="w-6 h-6 bg-blue-500 rounded"></div>
                            ) : (
                              <File className="w-6 h-6 text-blue-600" />
                            )}
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-gray-800">{item.name}</p>
                            <p className="text-sm text-gray-500">
                              {item.type === 'folder' ? `${item.items} items` : item.size}
                            </p>
                          </div>
                        </div>
                        {item.type === 'file' && (
                          <span className="text-blue-600 font-semibold">Select</span>
                        )}
                      </button>
                    ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  const renderLayout = () => (
    <div className="flex flex-col h-auto py-2 md:py-4">
      <button onClick={() => setStep('upload')} className="self-start mb-2 md:mb-3 inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">Print Settings</h2>
      <p className="text-gray-600 mb-3 md:mb-4 text-xs md:text-sm">Configure your print job</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {/* Paper Size */}
        <div>
          <label className="block text-gray-700 font-semibold mb-3 text-sm md:text-base">Paper Size</label>
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            <button
              onClick={() => setPaperSize('a4')}
              className={`p-3 md:p-4 rounded-xl border-2 transition-all text-sm md:text-base ${
                paperSize === 'a4' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
              }`}
            >
              <p className="font-semibold">A4</p>
              <p className="text-xs text-gray-500">210 × 297 mm</p>
            </button>
            <button
              onClick={() => setPaperSize('letter')}
              className={`p-3 md:p-4 rounded-xl border-2 transition-all text-sm md:text-base ${
                paperSize === 'letter' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
              }`}
            >
              <p className="font-semibold">Letter</p>
              <p className="text-xs text-gray-500">8.5 × 11 in</p>
            </button>
            <button
              onClick={() => setPaperSize('legal')}
              className={`p-3 md:p-4 rounded-xl border-2 transition-all text-sm md:text-base ${
                paperSize === 'legal' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
              }`}
            >
              <p className="font-semibold">Legal</p>
              <p className="text-xs text-gray-500">8.5 × 14 in</p>
            </button>
            <button
              onClick={() => setPaperSize('a3')}
              className={`p-3 md:p-4 rounded-xl border-2 transition-all text-sm md:text-base ${
                paperSize === 'a3' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
              }`}
            >
              <p className="font-semibold">A3</p>
              <p className="text-xs text-gray-500">297 × 420 mm</p>
            </button>
          </div>
        </div>

        {/* Orientation */}
        <div>
          <label className="block text-gray-700 font-semibold mb-3 text-sm md:text-base">Orientation</label>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <button
              onClick={() => setOrientation('portrait')}
              className={`p-4 md:p-6 rounded-xl border-2 transition-all ${
                orientation === 'portrait' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
              }`}
            >
              <div className="w-12 h-16 md:w-16 md:h-20 border-4 border-gray-400 mx-auto mb-2"></div>
              <p className="font-semibold text-sm md:text-base">Portrait</p>
            </button>
            <button
              onClick={() => setOrientation('landscape')}
              className={`p-4 md:p-6 rounded-xl border-2 transition-all ${
                orientation === 'landscape' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
              }`}
            >
              <div className="w-16 h-12 md:w-20 md:h-16 border-4 border-gray-400 mx-auto mb-2"></div>
              <p className="font-semibold text-sm md:text-base">Landscape</p>
            </button>
          </div>
        </div>

        {/* Color Mode */}
        <div>
          <label className="block text-gray-700 font-semibold mb-3 text-sm md:text-base">Color Mode</label>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <button
              onClick={() => setColorMode('bw')}
              className={`p-4 md:p-6 rounded-xl border-2 transition-all ${
                colorMode === 'bw' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
              }`}
            >
              <div className="flex gap-1 justify-center mb-2">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-gray-800 rounded"></div>
                <div className="w-5 h-5 md:w-6 md:h-6 bg-gray-400 rounded"></div>
              </div>
              <p className="font-semibold text-sm md:text-base">Black & White</p>
              <p className="text-xs text-gray-500">2 pesos/page</p>
            </button>
            <button
              onClick={() => setColorMode('color')}
              className={`p-4 md:p-6 rounded-xl border-2 transition-all ${
                colorMode === 'color' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
              }`}
            >
              <div className="flex gap-1 justify-center mb-2">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-red-500 rounded"></div>
                <div className="w-5 h-5 md:w-6 md:h-6 bg-blue-500 rounded"></div>
                <div className="w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded"></div>
              </div>
              <p className="font-semibold text-sm md:text-base">Color</p>
              <p className="text-xs text-gray-500">5 pesos/page</p>
            </button>
          </div>
        </div>

        {/* Pages to Print */}
        <div>
          <label className="block text-gray-700 font-semibold mb-3 text-sm md:text-base">Pages to Print</label>
          <div className="space-y-2 md:space-y-3">
            <button
              onClick={() => setPages('all')}
              className={`w-full p-3 md:p-4 rounded-xl border-2 transition-all text-left text-sm md:text-base ${
                pages === 'all' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
              }`}
            >
              <p className="font-semibold">All Pages (10 pages)</p>
            </button>
            <button
              onClick={() => setPages('range')}
              className={`w-full p-3 md:p-4 rounded-xl border-2 transition-all text-left text-sm md:text-base ${
                pages === 'range' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
              }`}
            >
              <p className="font-semibold">Page Range</p>
              {pages === 'range' && (
                <input
                  type="text"
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                  placeholder="e.g., 1-5, 8, 10"
                  className="mt-2 w-full p-2 border border-gray-300 rounded text-sm"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </button>
          </div>
        </div>

        {/* Number of Copies */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 font-semibold mb-3 text-sm md:text-base">Number of Copies</label>
          <div className="flex items-center gap-3 md:gap-4 bg-white p-3 md:p-4 rounded-xl border-2 border-gray-300 w-fit">
            <button
              onClick={() => setCopies(Math.max(1, copies - 1))}
              className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-lg font-bold text-lg md:text-xl hover:bg-gray-300"
            >
              -
            </button>
            <span className="text-xl md:text-2xl font-bold flex-1 text-center w-12">{copies}</span>
            <button
              onClick={() => setCopies(copies + 1)}
              className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-lg font-bold text-lg md:text-xl hover:bg-gray-300"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => setStep('summary')}
        className="mt-4 md:mt-6 self-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-full text-base md:text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all active:scale-95"
      >
        Continue to Payment
      </button>
    </div>
  );

  const renderSummary = () => (
    <div className="flex flex-col h-auto py-2 md:py-4">
      <button onClick={() => setStep('layout')} className="self-start mb-3 inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Order Summary</h2>

      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 max-w-2xl">
        <div className="space-y-4 mb-6">
          <div className="flex justify-between border-b pb-3">
            <span className="text-gray-600">Document:</span>
            <span className="font-semibold">{uploadedFile}</span>
          </div>
          <div className="flex justify-between border-b pb-3">
            <span className="text-gray-600">Connection:</span>
            <span className="font-semibold capitalize">{connectionType}</span>
          </div>
          <div className="flex justify-between border-b pb-3">
            <span className="text-gray-600">Paper Size:</span>
            <span className="font-semibold uppercase">{paperSize}</span>
          </div>
          <div className="flex justify-between border-b pb-3">
            <span className="text-gray-600">Orientation:</span>
            <span className="font-semibold capitalize">{orientation}</span>
          </div>
          <div className="flex justify-between border-b pb-3">
            <span className="text-gray-600">Color Mode:</span>
            <span className="font-semibold">{colorMode === 'bw' ? 'Black & White' : 'Color'}</span>
          </div>
          <div className="flex justify-between border-b pb-3">
            <span className="text-gray-600">Pages:</span>
            <span className="font-semibold">{pages === 'all' ? 'All (10)' : `Range (${calculatePages()})`}</span>
          </div>
          <div className="flex justify-between border-b pb-3">
            <span className="text-gray-600">Copies:</span>
            <span className="font-semibold">{copies}</span>
          </div>
          <div className="flex justify-between border-b pb-3">
            <span className="text-gray-600">Price per page:</span>
            <span className="font-semibold">{pricePerPage} pesos</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-4">
            <span>Total Pages:</span>
            <span>{totalPages * copies} pages</span>
          </div>
          <div className="flex justify-between text-2xl font-bold text-blue-600">
            <span>Total Cost:</span>
            <span>{totalCost} pesos</span>
          </div>
        </div>

        <button
          onClick={() => setStep('payment')}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );

  const renderPayment = () => (
    <div className="flex flex-col h-auto py-2 md:py-4">
      <button onClick={() => setStep('summary')} className="self-start mb-3 inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="flex flex-col items-center justify-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">Payment Method</h2>

        {/* Payment Method Selection */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 w-full max-w-sm mb-4">
          <button
            onClick={() => setPaymentMethod('coins')}
            className={`p-3 md:p-4 rounded-xl border-2 transition-all text-center ${
              paymentMethod === 'coins' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300 bg-white'
            }`}
          >
            <Coins className="w-8 h-8 mx-auto mb-2" style={{color: paymentMethod === 'coins' ? '#f59e0b' : '#6b7280'}} />
            <p className="font-semibold text-sm">Cash</p>
          </button>
          <button
            onClick={() => setPaymentMethod('gcash')}
            className={`p-3 md:p-4 rounded-xl border-2 transition-all text-center ${
              paymentMethod === 'gcash' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
            }`}
          >
            <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">GC</span>
            </div>
            <p className="font-semibold text-sm">GCash</p>
          </button>
        </div>

        {/* Cash Payment */}
        {paymentMethod === 'coins' && (
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-5 max-w-sm w-full">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg p-3 md:p-4 mb-3 text-center">
              <Coins className="w-12 h-12 text-white mx-auto mb-2" />
              <p className="text-white text-sm mb-1">Amount Due</p>
              <p className="text-white text-2xl md:text-3xl font-bold">{totalCost} pesos</p>
            </div>

            <div className="bg-gray-100 rounded-lg p-3 md:p-4 mb-3 text-center">
              <p className="text-gray-600 text-xs mb-1">Inserted</p>
              <p className="text-2xl md:text-3xl font-bold text-green-600">{insertedCoins} pesos</p>
              <p className="text-gray-600 mt-1 text-xs">
                {insertedCoins >= totalCost 
                  ? `Change: ${insertedCoins - totalCost} pesos` 
                  : `Remaining: ${totalCost - insertedCoins} pesos`}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              {[1, 5, 10].map(amount => (
                <button
                  key={amount}
                  onClick={() => handleInsertCoin(amount)}
                  disabled={insertedCoins >= totalCost}
                  className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white font-bold py-2 text-sm rounded-lg hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {amount} {amount === 1 ? 'peso' : 'pesos'}
                </button>
              ))}
            </div>

            {insertedCoins >= totalCost && (
              <button
                onClick={() => setStep('complete')}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Complete Payment
              </button>
            )}
          </div>
        )}

        {/* GCash Payment */}
        {paymentMethod === 'gcash' && (
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 max-w-sm w-full">
            <div className="text-center mb-4">
              <p className="text-gray-700 font-semibold mb-2">Amount Due</p>
              <p className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">{totalCost} pesos</p>
              <p className="text-xs text-gray-500">Scan with GCash app to pay</p>
            </div>

            {/* QR Code */}
            <div className="bg-white p-3 md:p-4 border-4 border-blue-500 rounded-2xl flex justify-center mb-4">
              <svg viewBox="0 0 200 200" className="w-40 h-40 md:w-48 md:h-48">
                <rect width="200" height="200" fill="white"/>
                <rect x="10" y="10" width="50" height="50" fill="black"/><rect x="20" y="20" width="30" height="30" fill="white"/>
                <rect x="140" y="10" width="50" height="50" fill="black"/><rect x="150" y="20" width="30" height="30" fill="white"/>
                <rect x="10" y="140" width="50" height="50" fill="black"/><rect x="20" y="150" width="30" height="30" fill="white"/>
                <rect x="70" y="10" width="10" height="10" fill="black"/><rect x="90" y="10" width="10" height="10" fill="black"/>
                <rect x="110" y="10" width="10" height="10" fill="black"/><rect x="80" y="20" width="10" height="10" fill="black"/>
                <rect x="100" y="20" width="10" height="10" fill="black"/><rect x="70" y="30" width="10" height="10" fill="black"/>
                <rect x="90" y="30" width="10" height="10" fill="black"/><rect x="110" y="30" width="10" height="10" fill="black"/>
                <rect x="10" y="70" width="10" height="10" fill="black"/><rect x="30" y="70" width="10" height="10" fill="black"/>
                <rect x="50" y="70" width="10" height="10" fill="black"/><rect x="70" y="70" width="10" height="10" fill="black"/>
                <rect x="90" y="70" width="10" height="10" fill="black"/><rect x="110" y="70" width="10" height="10" fill="black"/>
                <rect x="130" y="70" width="10" height="10" fill="black"/><rect x="150" y="70" width="10" height="10" fill="black"/>
                <rect x="170" y="70" width="10" height="10" fill="black"/><rect x="20" y="80" width="10" height="10" fill="black"/>
                <rect x="40" y="80" width="10" height="10" fill="black"/><rect x="80" y="80" width="10" height="10" fill="black"/>
                <rect x="120" y="80" width="10" height="10" fill="black"/><rect x="160" y="80" width="10" height="10" fill="black"/>
                <rect x="180" y="80" width="10" height="10" fill="black"/><rect x="10" y="90" width="10" height="10" fill="black"/>
                <rect x="50" y="90" width="10" height="10" fill="black"/><rect x="70" y="90" width="10" height="10" fill="black"/>
                <rect x="110" y="90" width="10" height="10" fill="black"/><rect x="130" y="90" width="10" height="10" fill="black"/>
                <rect x="170" y="90" width="10" height="10" fill="black"/><rect x="30" y="100" width="10" height="10" fill="black"/>
                <rect x="60" y="100" width="10" height="10" fill="black"/><rect x="100" y="100" width="10" height="10" fill="black"/>
                <rect x="140" y="100" width="10" height="10" fill="black"/><rect x="180" y="100" width="10" height="10" fill="black"/>
                <rect x="20" y="110" width="10" height="10" fill="black"/><rect x="40" y="110" width="10" height="10" fill="black"/>
                <rect x="80" y="110" width="10" height="10" fill="black"/><rect x="120" y="110" width="10" height="10" fill="black"/>
                <rect x="160" y="110" width="10" height="10" fill="black"/><rect x="10" y="120" width="10" height="10" fill="black"/>
                <rect x="50" y="120" width="10" height="10" fill="black"/><rect x="90" y="120" width="10" height="10" fill="black"/>
                <rect x="130" y="120" width="10" height="10" fill="black"/><rect x="170" y="120" width="10" height="10" fill="black"/>
                <rect x="70" y="140" width="10" height="10" fill="black"/><rect x="90" y="140" width="10" height="10" fill="black"/>
                <rect x="110" y="140" width="10" height="10" fill="black"/><rect x="130" y="140" width="10" height="10" fill="black"/>
                <rect x="150" y="140" width="10" height="10" fill="black"/><rect x="170" y="140" width="10" height="10" fill="black"/>
                <rect x="80" y="150" width="10" height="10" fill="black"/><rect x="100" y="150" width="10" height="10" fill="black"/>
                <rect x="140" y="150" width="10" height="10" fill="black"/><rect x="160" y="150" width="10" height="10" fill="black"/>
                <rect x="180" y="150" width="10" height="10" fill="black"/><rect x="70" y="160" width="10" height="10" fill="black"/>
                <rect x="110" y="160" width="10" height="10" fill="black"/><rect x="130" y="160" width="10" height="10" fill="black"/>
                <rect x="170" y="160" width="10" height="10" fill="black"/><rect x="90" y="170" width="10" height="10" fill="black"/>
                <rect x="110" y="170" width="10" height="10" fill="black"/><rect x="150" y="170" width="10" height="10" fill="black"/>
                <rect x="180" y="170" width="10" height="10" fill="black"/><rect x="70" y="180" width="10" height="10" fill="black"/>
                <rect x="100" y="180" width="10" height="10" fill="black"/><rect x="130" y="180" width="10" height="10" fill="black"/>
                <rect x="160" y="180" width="10" height="10" fill="black"/>
              </svg>
            </div>

            <p className="text-xs text-gray-600 text-center mb-4">Transaction ID: GC-{Math.random().toString(36).substr(2, 8).toUpperCase()}</p>

            <button
              onClick={() => setStep('complete')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              Payment Received
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderComplete = () => (
    <div className="flex flex-col items-center justify-center h-full py-2 md:py-4">
      <div className="bg-green-100 rounded-full p-4 md:p-6 mb-3 md:mb-4">
        <CheckCircle className="w-16 h-16 md:w-20 md:h-20 text-green-600" />
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 md:mb-3">Printing Complete!</h2>
      <p className="text-gray-600 mb-1 md:mb-2 text-sm md:text-base">Your documents are ready</p>
      <p className="text-gray-500 mb-4 md:mb-6 text-sm md:text-base">Please collect them from the output tray</p>
      
      <div className="bg-white rounded-xl p-3 md:p-4 shadow-lg mb-4 md:mb-6">
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
        </div>
      </div>

      <button
        onClick={() => {
          setStep('start');
          setConnectionType(null);
          setUploadedFile(null);
          setInsertedCoins(0);
          setConnectionState('idle');
          setAvailableDevices([]);
          setSelectedDevice(null);
        }}
        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 md:px-8 py-2 md:py-3 rounded-full text-base md:text-lg font-semibold transition-all"
      >
        Print Another Document
      </button>
    </div>
  );

  return (
    <div className="h-screen w-screen overflow-auto bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-2 md:p-4 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        {step === 'start' && renderStart()}
        {step === 'connection' && renderConnection()}
        {step === 'upload' && renderUpload()}
        {step === 'layout' && renderLayout()}
        {step === 'summary' && renderSummary()}
        {step === 'payment' && renderPayment()}
        {step === 'complete' && renderComplete()}
      </div>
    </div>
  );
}