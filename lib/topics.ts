export type TopicDomain = "network" | "os" | "algorithm" | "database";

export type TopicStatus = "ready" | "draft";

export type Topic = {
  slug: string;
  title: string;
  description: string;
  domain: TopicDomain;
  status: TopicStatus;
  hasVisualization: boolean;
};

export const topics: Topic[] = [
  {
    slug: "tcp-3-way-handshake",
    title: "TCP 3-way Handshake",
    description:
      "클라이언트와 서버가 SYN / SYN-ACK / ACK 세 번의 패킷 교환으로 연결을 수립하는 과정.",
    domain: "network",
    status: "ready",
    hasVisualization: true,
  },
  {
    slug: "osi-7-layers",
    title: "OSI 7계층",
    description:
      "네트워크 통신을 물리 계층부터 응용 계층까지 7개의 추상 계층으로 나눈 표준 모델.",
    domain: "network",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "https-handshake",
    title: "HTTPS Handshake",
    description:
      "TLS 핸드셰이크로 인증서를 교환하고 대칭키를 합의해 안전한 채널을 만드는 흐름.",
    domain: "network",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "dns-resolution",
    title: "DNS Resolution",
    description:
      "도메인 이름이 IP 주소로 변환되는 재귀/반복 질의와 캐시 단계.",
    domain: "network",
    status: "ready",
    hasVisualization: false,
  },
  {
    slug: "http-versions",
    title: "HTTP/1.1 → HTTP/2 → HTTP/3",
    description:
      "헤드 오브 라인 블로킹, 멀티플렉싱, QUIC까지 — HTTP가 진화해 온 이유.",
    domain: "network",
    status: "ready",
    hasVisualization: false,
  },
];

export function getTopic(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug);
}
