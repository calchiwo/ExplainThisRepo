using System;
using System.Diagnostics;
using System.IO;
using System.Runtime.InteropServices;

namespace ExplainThisRepo
{
    class Program
    {
        static int Main(string[] args)
        {
            try
            {
                string binaryPath = GetBinaryPath();
                
                var processInfo = new ProcessStartInfo
                {
                    FileName = binaryPath,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                foreach (var arg in args)
                {
                    processInfo.ArgumentList.Add(arg);
                }

                using var process = Process.Start(processInfo);
                if (process != null)
                {
                    process.WaitForExit();
                    return process.ExitCode;
                }
                
                return 1;
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"error: {ex.Message}");
                return 1;
            }
        }

        static string GetBinaryPath()
        {
            string targetKey = GetTargetKey();
            string binaryName = RuntimeInformation.IsOSPlatform(OSPlatform.Windows) ? "explainthisrepo.exe" : "explainthisrepo";

            string launcherDir = AppContext.BaseDirectory;
            string binaryPath = Path.Combine(launcherDir, "native", targetKey, binaryName);

            if (!File.Exists(binaryPath))
            {
                throw new FileNotFoundException($"Bundled binary not found: {binaryPath}");
            }

            return binaryPath;
        }

        static string GetTargetKey()
        {
            if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX))
            {
                return RuntimeInformation.OSArchitecture == Architecture.Arm64 ? "darwin-arm64" : "darwin-x64";
            }
            if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
            {
                return RuntimeInformation.OSArchitecture == Architecture.Arm64 ? "linux-arm64" : "linux-x64";
            }
            if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
            {
                return "win-x64";
            }

            throw new PlatformNotSupportedException($"Unsupported platform: {RuntimeInformation.OSDescription} {RuntimeInformation.OSArchitecture}");
        }
    }
}
