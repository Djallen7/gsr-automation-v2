# ADR-0005: Dropbox delivery carries no metadata

Date: 2026-06-06 (recorded 2026-06-08)
Status: Accepted

## Context

Dropbox is the broadcast-master drop to unnamed partner stations and the source for OTA broadcast. Partners pull the finished file; they do not consume our descriptions, tags, or thumbnails. Treating Dropbox like a metadata-bearing platform (YouTube, RLN) would needlessly block delivery on the metadata step.

## Decision

Dropbox delivery requires no metadata. Push the master file only. The folder structure is flat, one folder per show (a separate web-stream-episodes folder still needs creating). Do not gate a Dropbox delivery on metadata generation. File naming still follows the `{episode_label}_{descriptor}_{version}.{ext}` convention, and the Dropbox 150 MB single-request cap means uploads are chunked.

## Consequences

- The metadata step (ADR-0004) is decoupled from the Dropbox delivery step.
- Dropbox can fire as soon as the master exists, independent of metadata.
- Metadata is only required for the platforms that actually display it (YouTube, RLN, podcast).
