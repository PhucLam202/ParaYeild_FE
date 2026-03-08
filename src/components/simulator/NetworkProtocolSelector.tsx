import CustomSelect from "@/components/ui/CustomSelect";
import { formatLabel } from "@/hooks/useSimulation";

interface Props {
    network: string;
    setNetwork: (v: string) => void;
    protocol: string;
    setProtocol: (v: string) => void;
    fetchedParachains: { id: string; name: string }[];
    fetchedProtocols: { id: string; label: string }[];
}

export default function NetworkProtocolSelector({
    network, setNetwork,
    protocol, setProtocol,
    fetchedParachains, fetchedProtocols,
}: Props) {
    return (
        <>
            <div className="space-y-2">
                <CustomSelect
                    label="Parachain Selection"
                    value={network}
                    onChange={setNetwork}
                    options={fetchedParachains.map(p => ({ label: formatLabel(p.name), value: p.id }))}
                />
            </div>
            <div className="space-y-2">
                <CustomSelect
                    label="Protocol Type"
                    value={protocol}
                    onChange={setProtocol}
                    options={fetchedProtocols.map(p => ({ label: p.label, value: p.id }))}
                />
            </div>
        </>
    );
}
